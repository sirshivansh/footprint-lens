import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db } from "@/db";
import { cohorts, cohortMembers, quests, questProgress, userProfiles, users } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

const AVATAR_COLORS = ["#5B8C5A", "#C67B5C", "#7BA7BC", "#E5D3B3", "#2A472E", "#4A6B6C", "#8C4F35", "#6E5B4F"];
const AVATAR_SHAPES = ["circle", "square", "triangle", "hexagon", "pentagon", "diamond", "star"];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const cohortsRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // 1. Find the member record for the current user
    const [membership] = await db
      .select()
      .from(cohortMembers)
      .where(and(eq(cohortMembers.userId, userId), sql`${cohortMembers.leftAt} IS NULL`));

    if (!membership) {
      return null;
    }

    // 2. Fetch the cohort details
    const [cohort] = await db
      .select()
      .from(cohorts)
      .where(eq(cohorts.id, membership.cohortId));

    if (!cohort) {
      return null;
    }

    // 3. Fetch all members of this cohort
    const membersList = await db
      .select({
        id: cohortMembers.id,
        avatarColor: cohortMembers.avatarColor,
        avatarShape: cohortMembers.avatarShape,
        role: cohortMembers.role,
        joinedAt: cohortMembers.joinedAt,
        isSelf: sql<boolean>`${cohortMembers.userId} = ${userId}`,
      })
      .from(cohortMembers)
      .where(and(eq(cohortMembers.cohortId, cohort.id), sql`${cohortMembers.leftAt} IS NULL`));

    // 4. Fetch active quests for this cohort
    const activeQuests = await db
      .select()
      .from(quests)
      .where(and(eq(quests.cohortId, cohort.id), eq(quests.status, "active")));

    // 5. Fetch recent anonymized activity feed (quest contributions or custom progress)
    // For MVP, we can query recent quest progress records for this cohort's quests
    let activityFeed: any[] = [];
    if (activeQuests.length > 0) {
      const questIds = activeQuests.map((q) => q.id);
      
      // Query recent progress entries
      const progressEntries = await db
        .select({
          id: questProgress.id,
          contributionCo2eKg: questProgress.contributionCo2eKg,
          actionDescription: questProgress.actionDescription,
          recordedAt: questProgress.recordedAt,
          // Fetch member colors to tie the avatar visually in the feed anonymously
          avatarColor: cohortMembers.avatarColor,
          avatarShape: cohortMembers.avatarShape,
        })
        .from(questProgress)
        .innerJoin(
          cohortMembers,
          and(
            eq(cohortMembers.userId, questProgress.userId),
            eq(cohortMembers.cohortId, cohort.id)
          )
        )
        .where(sql`${questProgress.questId} IN ${questIds}`)
        .orderBy(desc(questProgress.recordedAt))
        .limit(10);

      activityFeed = progressEntries.map((entry) => ({
        id: entry.id,
        text: `Someone completed: ${entry.actionDescription || "carbon reduction"} · Saved ${parseFloat(entry.contributionCo2eKg || "0").toFixed(1)} kg CO₂e`,
        timestamp: entry.recordedAt,
        avatarColor: entry.avatarColor,
        avatarShape: entry.avatarShape,
      }));
    }

    // If feed is empty, seed with some dummy anonymous activity for UI demonstration
    if (activityFeed.length === 0) {
      activityFeed = [
        {
          id: "feed-1",
          text: "Someone swapped to oat milk · Saved 1.8 kg CO₂e",
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
          avatarColor: AVATAR_COLORS[0],
          avatarShape: AVATAR_SHAPES[0],
        },
        {
          id: "feed-2",
          text: "Someone reduced thermostat by 1°C · Saved 2.4 kg CO₂e",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hrs ago
          avatarColor: AVATAR_COLORS[2],
          avatarShape: AVATAR_SHAPES[3],
        },
        {
          id: "feed-3",
          text: "Someone skipped short flight for rail · Saved 120.0 kg CO₂e",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          avatarColor: AVATAR_COLORS[4],
          avatarShape: AVATAR_SHAPES[2],
        },
      ];
    }

    return {
      cohort,
      membership,
      members: membersList,
      activeQuests,
      activityFeed,
    };
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(50),
        type: z.enum(["friends_family", "neighbors", "workplace", "interest"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // 1. Create cohort
      const inviteCode = generateInviteCode();
      const [newCohort] = await db
        .insert(cohorts)
        .values({
          name: input.name,
          type: input.type,
          inviteCode,
          maxMembers: 12,
        })
        .returning();

      // 2. Add creator to cohort members
      const color = getRandomElement(AVATAR_COLORS);
      const shape = getRandomElement(AVATAR_SHAPES);

      await db.insert(cohortMembers).values({
        cohortId: newCohort.id,
        userId,
        avatarColor: color,
        avatarShape: shape,
        role: "creator",
      });

      // 3. Seed an active Quest for this cohort
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 30); // 30 days quest

      await db.insert(quests).values({
        cohortId: newCohort.id,
        questType: "conservation_anchor",
        title: "Conservation Anchor",
        description: "Swarm together to offset 500 kg of CO₂e in 30 days and protect the local woodland ecosystem.",
        targetCo2eKg: "500.00",
        currentCo2eKg: "0.00",
        status: "active",
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      });

      return {
        success: true,
        cohortId: newCohort.id,
        inviteCode,
      };
    }),

  join: protectedProcedure
    .input(
      z.object({
        inviteCode: z.string().length(6).toUpperCase(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // 1. Find cohort by invite code
      const [cohort] = await db
        .select()
        .from(cohorts)
        .where(eq(cohorts.inviteCode, input.inviteCode));

      if (!cohort) {
        throw new Error("Cohort not found. Please verify the invite code.");
      }

      // 2. Check if user is already in a cohort
      const [existingMembership] = await db
        .select()
        .from(cohortMembers)
        .where(and(eq(cohortMembers.userId, userId), sql`${cohortMembers.leftAt} IS NULL`));

      if (existingMembership) {
        throw new Error("You are already in a cohort. Leave your current cohort first.");
      }

      // 3. Check member limit
      const currentMembers = await db
        .select()
        .from(cohortMembers)
        .where(and(eq(cohortMembers.cohortId, cohort.id), sql`${cohortMembers.leftAt} IS NULL`));

      if (currentMembers.length >= (cohort.maxMembers || 12)) {
        throw new Error("This cohort is already full (max 12 members).");
      }

      // 4. Join cohort
      const color = getRandomElement(AVATAR_COLORS);
      const shape = getRandomElement(AVATAR_SHAPES);

      await db.insert(cohortMembers).values({
        cohortId: cohort.id,
        userId,
        avatarColor: color,
        avatarShape: shape,
        role: "member",
      });

      return {
        success: true,
        cohortId: cohort.id,
      };
    }),

  leave: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Soft delete membership by setting leftAt
    await db
      .update(cohortMembers)
      .set({ leftAt: new Date() })
      .where(and(eq(cohortMembers.userId, userId), sql`${cohortMembers.leftAt} IS NULL`));

    return { success: true };
  }),
});
