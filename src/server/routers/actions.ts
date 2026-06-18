import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db } from "@/db";
import { actions, userActions, userProfiles, actionTiers, forestTrees } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getCurrentAction } from "../services/action-engine";

export const actionsRouter = router({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return getCurrentAction(userId);
  }),

  complete: protectedProcedure
    .input(
      z.object({
        actionId: z.string().uuid(),
        actualCo2eSavedKg: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // 1. Record completed action in userActions
      const [existingUserAction] = await db
        .select()
        .from(userActions)
        .where(and(eq(userActions.userId, userId), eq(userActions.actionId, input.actionId)));

      if (existingUserAction) {
        await db
          .update(userActions)
          .set({
            status: "completed",
            actualCo2eSavedKg: input.actualCo2eSavedKg.toString(),
            completedAt: new Date(),
            lastShownAt: new Date(),
          })
          .where(eq(userActions.id, existingUserAction.id));
      } else {
        await db.insert(userActions).values({
          userId,
          actionId: input.actionId,
          status: "completed",
          actualCo2eSavedKg: input.actualCo2eSavedKg.toString(),
          completedAt: new Date(),
        });
      }

      // Fetch action details to know category for forest planting
      const [actionDetails] = await db
        .select()
        .from(actions)
        .where(eq(actions.id, input.actionId));

      const category = actionDetails?.category || "other";

      // 2. Fetch profile to update total reduced
      const [profile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));

      let totalReduced = 0;
      let treeCount = 0;
      if (profile) {
        totalReduced = parseFloat(profile.totalCo2ReducedKg || "0");
        treeCount = profile.forestTreeCount || 0;
      }

      const newTotalReduced = totalReduced + input.actualCo2eSavedKg;
      
      // Calculate how many trees they SHOULD have: 1 tree per 100 kg CO2e saved
      const expectedTreeCount = Math.floor(newTotalReduced / 100);
      const newTreesToPlant = expectedTreeCount - treeCount;

      // Plant trees if threshold crossed
      if (newTreesToPlant > 0 && profile) {
        // Map category to tree species
        const speciesMap: Record<string, string> = {
          transport: "birch",
          diet: "oak",
          energy: "pine",
          shopping: "spruce",
          other: "cedar",
        };
        const species = speciesMap[category.toLowerCase()] || "oak";

        for (let i = 0; i < newTreesToPlant; i++) {
          // Generate random position on coordinate grid (0-100)
          const posX = Math.floor(Math.random() * 90) + 5;
          const posY = Math.floor(Math.random() * 90) + 5;
          const isMilestone = (treeCount + i + 1) % 10 === 0; // every 10th tree is a milestone
          const milestoneWildlife = isMilestone ? "fox" : null;

          await db.insert(forestTrees).values({
            userId,
            treeSpecies: species,
            reductionCategory: category,
            co2eRepresentedKg: "100.00",
            positionX: posX,
            positionY: posY,
            isMilestone,
            wildlifeUnlocked: milestoneWildlife,
          });
        }

        // Update profile
        await db
          .update(userProfiles)
          .set({
            totalCo2ReducedKg: newTotalReduced.toFixed(2),
            forestTreeCount: expectedTreeCount,
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, userId));
      } else if (profile) {
        // Just update reduction total
        await db
          .update(userProfiles)
          .set({
            totalCo2ReducedKg: newTotalReduced.toFixed(2),
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, userId));
      }

      // 3. Return progress details
      const completedList = await db
        .select()
        .from(userActions)
        .where(and(eq(userActions.userId, userId), eq(userActions.status, "completed")));

      return {
        success: true,
        co2eSavedKg: input.actualCo2eSavedKg,
        totalActionsCompleted: completedList.length,
        forestUpdate: {
          newTree: newTreesToPlant > 0,
          plantedCount: newTreesToPlant,
          progressToNextTreePercent: Math.round((newTotalReduced % 100)),
        },
      };
    }),

  dismiss: protectedProcedure
    .input(z.object({ actionId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const [existing] = await db
        .select()
        .from(userActions)
        .where(and(eq(userActions.userId, userId), eq(userActions.actionId, input.actionId)));

      if (existing) {
        const dismissCount = (existing.dismissalCount || 0) + 1;
        const status = dismissCount >= 3 ? "retired" : "skipped";
        
        await db
          .update(userActions)
          .set({
            status,
            dismissalCount: dismissCount,
            lastShownAt: new Date(),
          })
          .where(eq(userActions.id, existing.id));
      } else {
        await db.insert(userActions).values({
          userId,
          actionId: input.actionId,
          status: "skipped",
          dismissalCount: 1,
        });
      }

      return { success: true };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [action] = await db
        .select()
        .from(actions)
        .where(eq(actions.id, input.id));
      return action || null;
    }),

  getTiers: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Fetch all tiers
    const tiers = await db.select().from(actionTiers).orderBy(actionTiers.tierLevel);

    // Fetch user completions per tier
    const completions = await db
      .select({
        actionId: userActions.actionId,
        tierId: actions.tierId,
      })
      .from(userActions)
      .innerJoin(actions, eq(actions.id, userActions.actionId))
      .where(and(eq(userActions.userId, userId), eq(userActions.status, "completed")));

    // Count completions per tier
    const completedTiersList = tiers.map((t) => {
      const count = completions.filter((c) => c.tierId === t.id).length;
      
      return {
        name: t.name,
        level: t.tierLevel,
        icon: t.icon || "🟢",
        color: t.color || "#5B8C5A",
        unlockThreshold: t.unlockThreshold,
        completed: count,
        description: t.description || "",
      };
    });

    return completedTiersList;
  }),
});
