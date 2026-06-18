import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db } from "@/db";
import { userProfiles, userPreferences, users, transactions } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { calculateProfileEstimate, seedUserTransactions } from "../services/carbon-engine";
import { hashPassword } from "@/lib/auth";

const onboardingInputSchema = z.object({
  homeType: z.enum(["apartment", "house", "shared"]),
  primaryTransport: z.enum(["car", "transit", "bike", "mix"]),
  dietType: z.enum(["omnivore", "flexitarian", "vegetarian", "vegan"]),
  flightFrequency: z.enum(["0", "1-3", "4-8", "9+"]),
  shoppingHabit: z.enum(["minimal", "average", "frequent"]),
});

export const profileRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // 1. Get user record
    const [userRecord] = await db
      .select({ id: users.id, email: users.email, isAnonymous: users.isAnonymous })
      .from(users)
      .where(eq(users.id, userId));

    // 2. Get profile
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));

    // 3. Get preferences
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    return {
      user: userRecord,
      profile: profile || null,
      preferences: preferences || null,
    };
  }),

  saveOnboarding: protectedProcedure
    .input(onboardingInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Calculate the initial estimated footprint
      const estimate = calculateProfileEstimate(input);

      // Check if profile already exists
      const [existingProfile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));

      if (existingProfile) {
        // Update existing profile
        await db
          .update(userProfiles)
          .set({
            homeType: input.homeType,
            primaryTransport: input.primaryTransport,
            dietType: input.dietType,
            flightFrequency: input.flightFrequency,
            shoppingHabit: input.shoppingHabit,
            onboardingCompletedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, userId));
      } else {
        // Create new profile
        await db.insert(userProfiles).values({
          userId,
          homeType: input.homeType,
          primaryTransport: input.primaryTransport,
          dietType: input.dietType,
          flightFrequency: input.flightFrequency,
          shoppingHabit: input.shoppingHabit,
          accuracyScore: 55,
          onboardingCompletedAt: new Date(),
        });
      }

      // Mark user as having completed onboarding (update isAnonymous if email is present, etc.)
      // Trigger the mock bank connection auto-seeding of transactions
      try {
        await seedUserTransactions(userId);
        
        // Update user profile accuracy score after transaction seeding (Plaid mock sync jumps to 78%)
        await db
          .update(userProfiles)
          .set({
            accuracyScore: 78,
          })
          .where(eq(userProfiles.userId, userId));
      } catch (seedError) {
        console.error("Failed to seed transactions for onboarded user:", seedError);
      }

      return {
        success: true,
        estimatedAnnualCo2eKg: estimate.total,
        breakdown: estimate.breakdown,
      };
    }),

  connectBank: protectedProcedure
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      await db
        .update(userProfiles)
        .set({
          accuracyScore: 92,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId));
      return { success: true };
    }),

  disconnectBank: protectedProcedure
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      await db
        .update(userProfiles)
        .set({
          accuracyScore: 78,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId));
      return { success: true };
    }),

  updatePreferences: protectedProcedure
    .input(
      z.object({
        theme: z.enum(["light", "dark"]).optional(),
        notificationFrequency: z.enum(["daily", "weekly", "monthly", "never"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const [existingPref] = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId));

      if (existingPref) {
        await db
          .update(userPreferences)
          .set({
            ...input,
          })
          .where(eq(userPreferences.userId, userId));
      } else {
        await db.insert(userPreferences).values({
          userId,
          theme: input.theme || "light",
          notificationFrequency: input.notificationFrequency || "weekly",
        });
      }

      return { success: true };
    }),

  promoteAccount: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // 1. Check if email is already in use
      const [existingUser] = await db
        .select()
        .from(users)
        .where(and(eq(users.email, input.email), ne(users.id, userId)));

      if (existingUser) {
        throw new Error("This email is already registered.");
      }

      // 2. Hash password and update user
      const passwordHash = hashPassword(input.password);
      await db
        .update(users)
        .set({
          email: input.email,
          passwordHash,
          isAnonymous: false,
          authProvider: "email",
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { success: true, email: input.email };
    }),

  togglePauseMode: protectedProcedure
    .input(z.object({ paused: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [existingPref] = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId));

      if (existingPref) {
        await db
          .update(userPreferences)
          .set({ pauseMode: input.paused })
          .where(eq(userPreferences.userId, userId));
      } else {
        await db.insert(userPreferences).values({
          userId,
          pauseMode: input.paused,
        });
      }
      return { success: true };
    }),

  exportUserData: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      const [profile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));

      const [preferences] = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId));

      const userTransactions = await db
        .select()
        .from(transactions)
        .where(eq(transactions.userId, userId));

      return {
        exportedAt: new Date().toISOString(),
        profile: profile || null,
        preferences: preferences || null,
        transactions: userTransactions.map(t => ({
          merchantName: t.merchantName,
          amount: t.amount,
          currency: t.currency,
          transactionDate: t.transactionDate,
        })),
      };
    }),

  deleteAccount: protectedProcedure
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      await db.delete(users).where(eq(users.id, userId));
      return { success: true };
    }),
});
