// ─── Shared Zod Schemas ───

import { z } from "zod";

// Onboarding profile
export const onboardingProfileSchema = z.object({
  homeType: z.enum(["apartment", "house", "shared"]),
  primaryTransport: z.enum(["car", "transit", "bike", "mix"]),
  dietType: z.enum(["omnivore", "flexitarian", "vegetarian", "vegan"]),
  flightFrequency: z.enum(["0", "1-3", "4-8", "9+"]),
  shoppingHabit: z.enum(["minimal", "average", "frequent"]),
});

// Carbon query params
export const carbonSummaryInputSchema = z.object({
  period: z.enum(["day", "week", "month", "year"]).default("month"),
  date: z.string().optional(),
  compare: z.boolean().default(true),
});

// Transaction pagination
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(20),
});

// Manual transaction entry
export const manualTransactionSchema = z.object({
  merchantName: z.string().min(1).max(255),
  category: z.enum(["transport", "diet", "energy", "shopping", "other"]),
  amount: z.number().positive(),
  currency: z.string().length(3).default("USD"),
  transactionDate: z.string(), // ISO date
  notes: z.string().max(500).optional(),
});

// Transaction correction
export const transactionCorrectionSchema = z.object({
  correctCategory: z.string().min(1),
  correctSubcategory: z.string().optional(),
  note: z.string().max(500).optional(),
});

// Cohort creation
export const createCohortSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["friends_family", "neighbors", "workplace", "interest"]),
  maxMembers: z.number().int().min(4).max(12).default(8),
});

// Join cohort
export const joinCohortSchema = z.object({
  inviteCode: z.string().min(1).max(12),
});

// Action completion
export const completeActionSchema = z.object({
  actionId: z.string().uuid(),
  actualCo2eSavedKg: z.number().optional(),
  note: z.string().max(500).optional(),
});

// Action dismissal
export const dismissActionSchema = z.object({
  actionId: z.string().uuid(),
  reason: z.enum(["not_applicable", "too_hard", "already_doing", "other"]).optional(),
});

// Preferences update
export const preferencesUpdateSchema = z.object({
  theme: z.enum(["light", "dark"]).optional(),
  notificationFrequency: z.enum(["daily", "weekly", "monthly", "none"]).optional(),
  pauseMode: z.boolean().optional(),
  pauseUntil: z.string().optional(),
});

// Receipt scan
export const receiptScanInputSchema = z.object({
  imageDataUrl: z.string(), // Base64 data URL
});
