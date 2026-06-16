import { pgTable, uuid, varchar, boolean, timestamp, text, integer, decimal, date, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── 1. CORE USER TABLES ───

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  authProvider: varchar("auth_provider", { length: 50 }), // 'google', 'email', 'anonymous'
  authProviderId: varchar("auth_provider_id", { length: 255 }),
  isAnonymous: boolean("is_anonymous").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }), // Soft delete
});

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  homeType: varchar("home_type", { length: 20 }), // 'apartment', 'house', 'shared'
  primaryTransport: varchar("primary_transport", { length: 20 }), // 'car', 'transit', 'bike', 'mix'
  dietType: varchar("diet_type", { length: 20 }), // 'omnivore', 'flexitarian', 'vegetarian', 'vegan'
  flightFrequency: varchar("flight_frequency", { length: 10 }), // '0', '1-3', '4-8', '9+'
  shoppingHabit: varchar("shopping_habit", { length: 20 }), // 'minimal', 'average', 'frequent'
  accuracyScore: integer("accuracy_score").default(55),
  totalCo2ReducedKg: decimal("total_co2_reduced_kg", { precision: 12, scale: 2 }).default("0.00"),
  forestTreeCount: integer("forest_tree_count").default(0),
  region: varchar("region", { length: 10 }), // ISO country code
  timezone: varchar("timezone", { length: 50 }),
  onboardingCompletedAt: timestamp("onboarding_completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  theme: varchar("theme", { length: 20 }).default("light"), // 'light', 'dark'
  notificationFrequency: varchar("notification_frequency", { length: 20 }).default("weekly"),
  locationTrackingEnabled: boolean("location_tracking_enabled").default(false),
  arEnabled: boolean("ar_enabled").default(false),
  pauseMode: boolean("pause_mode").default(false),
  pauseUntil: timestamp("pause_until", { withTimezone: true }),
  privacySettings: jsonb("privacy_settings"),
});

// ─── 2. DATA SOURCES & TRANSACTIONS ───

export const dataSources = pgTable("data_sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sourceType: varchar("source_type", { length: 50 }), // 'bank', 'utility', 'manual'
  provider: varchar("provider", { length: 50 }), // 'plaid', 'manual'
  providerAccountId: varchar("provider_account_id", { length: 255 }),
  status: varchar("status", { length: 20 }), // 'active', 'inactive'
  credentialsRef: jsonb("credentials_ref"),
  lastSyncAt: timestamp("last_sync_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const merchantCategories = pgTable("merchant_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  merchantPattern: varchar("merchant_pattern", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // 'transport', 'diet', 'energy', 'shopping'
  subcategory: varchar("subcategory", { length: 100 }),
  defaultEmissionFactor: decimal("default_emission_factor", { precision: 12, scale: 6 }).notNull(),
  confidenceScore: integer("confidence_score").default(80),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dataSourceId: uuid("data_source_id").references(() => dataSources.id, { onDelete: "set null" }),
  externalId: varchar("external_id", { length: 255 }).unique(),
  merchantName: varchar("merchant_name", { length: 255 }).notNull(),
  merchantCategory: varchar("merchant_category", { length: 100 }),
  categoryId: uuid("category_id").references(() => merchantCategories.id, { onDelete: "set null" }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  transactionDate: date("transaction_date").notNull(),
  userCorrected: boolean("user_corrected").default(false),
  rawData: jsonb("raw_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const emissionFactors = pgTable("emission_factors", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: varchar("source", { length: 100 }).notNull(), // 'DEFRA', 'EPA', 'Climatiq'
  category: varchar("category", { length: 50 }).notNull(), // 'diet', 'transport', 'energy', 'shopping'
  subcategory: varchar("subcategory", { length: 50 }),
  activityUnit: varchar("activity_unit", { length: 20 }).notNull(), // 'km', 'kg', 'kWh', 'USD'
  factorKgCo2e: decimal("factor_kg_co2e", { precision: 10, scale: 4 }).notNull(),
  region: varchar("region", { length: 10 }), // ISO country code
  validFrom: date("valid_from"),
  validTo: date("valid_to"),
  metadata: jsonb("metadata"),
});

export const receiptScans = pgTable("receipt_scans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  ocrProvider: varchar("ocr_provider", { length: 30 }).default("tesseract"),
  status: varchar("status", { length: 20 }).default("processing"), // 'processing', 'completed', 'failed'
  rawOcrResult: jsonb("raw_ocr_result"),
  scannedAt: timestamp("scanned_at", { withTimezone: true }).defaultNow(),
});

export const receiptItems = pgTable("receipt_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  receiptScanId: uuid("receipt_scan_id").notNull().references(() => receiptScans.id, { onDelete: "cascade" }),
  itemName: varchar("item_name", { length: 255 }).notNull(),
  quantity: decimal("quantity", { precision: 8, scale: 2 }).default("1.00"),
  unit: varchar("unit", { length: 20 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  impactLevel: varchar("impact_level", { length: 10 }), // 'low', 'moderate', 'high'
  co2eKg: decimal("co2e_kg", { precision: 10, scale: 4 }),
  suggestedSwap: varchar("suggested_swap", { length: 255 }),
  swapCo2eKg: decimal("swap_co2e_kg", { precision: 10, scale: 4 }),
  productData: jsonb("product_data"),
});

export const carbonRecords = pgTable("carbon_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  transactionId: uuid("transaction_id").references(() => transactions.id, { onDelete: "set null" }),
  receiptItemId: uuid("receipt_item_id").references(() => receiptItems.id, { onDelete: "set null" }),
  emissionFactorId: uuid("emission_factor_id").references(() => emissionFactors.id, { onDelete: "set null" }),
  sourceType: varchar("source_type", { length: 30 }).notNull(), // 'bank_transaction', 'receipt', 'utility', 'manual', 'profile_estimate'
  co2eKg: decimal("co2e_kg", { precision: 10, scale: 4 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  subcategory: varchar("subcategory", { length: 50 }),
  recordDate: date("record_date").notNull(),
  calculationDetails: jsonb("calculation_details"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ─── 3. ACTION ENGINE TABLES ───

export const actionTiers = pgTable("action_tiers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(), // 'Light Switches', 'Habit Builders', 'Lifestyle Levers'
  tierLevel: integer("tier_level").notNull().unique(), // 1, 2, 3
  icon: varchar("icon", { length: 20 }),
  color: varchar("color", { length: 7 }),
  unlockThreshold: integer("unlock_threshold").notNull(), // Number of previous tier completions required
  description: text("description"),
});

export const actions = pgTable("actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tierId: uuid("tier_id").notNull().references(() => actionTiers.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  impactDescription: text("impact_description"),
  category: varchar("category", { length: 50 }).notNull(), // 'diet', 'transport', 'energy', 'shopping'
  estimatedCo2eReductionKg: decimal("estimated_co2e_reduction_kg", { precision: 10, scale: 4 }),
  feasibilityScore: integer("feasibility_score"), // 1-100
  contextRules: jsonb("context_rules"), // e.g. {"time": "morning"}
  profileMatchRules: jsonb("profile_match_rules"), // e.g. {"diet": "omnivore"}
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const userActions = pgTable("user_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  actionId: uuid("action_id").notNull().references(() => actions.id),
  status: varchar("status", { length: 20 }).default("shown"), // 'shown', 'completed', 'skipped', 'retired'
  dismissalCount: integer("dismissal_count").default(0),
  actualCo2eSavedKg: decimal("actual_co2e_saved_kg", { precision: 10, scale: 4 }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  firstShownAt: timestamp("first_shown_at", { withTimezone: true }).defaultNow(),
  lastShownAt: timestamp("last_shown_at", { withTimezone: true }).defaultNow(),
});

// ─── 4. SOCIAL & COHORTS TABLES ───

export const cohorts = pgTable("cohorts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 30 }).notNull(), // 'friends_family', 'neighbors', 'workplace', 'interest'
  inviteCode: varchar("invite_code", { length: 12 }).unique().notNull(),
  region: varchar("region", { length: 10 }),
  maxMembers: integer("max_members").default(12),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const cohortMembers = pgTable("cohort_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  cohortId: uuid("cohort_id").notNull().references(() => cohorts.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  avatarColor: varchar("avatar_color", { length: 7 }).notNull(),
  avatarShape: varchar("avatar_shape", { length: 30 }).notNull(),
  role: varchar("role", { length: 20 }).default("member"), // 'creator', 'member'
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  leftAt: timestamp("left_at", { withTimezone: true }),
});

export const quests = pgTable("quests", {
  id: uuid("id").primaryKey().defaultRandom(),
  cohortId: uuid("cohort_id").notNull().references(() => cohorts.id, { onDelete: "cascade" }),
  questType: varchar("quest_type", { length: 30 }).notNull(), // 'conservation_anchor', 'offset_race', 'swap_sprint'
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  targetCo2eKg: decimal("target_co2e_kg", { precision: 10, scale: 2 }),
  currentCo2eKg: decimal("current_co2e_kg", { precision: 10, scale: 2 }).default("0.00"),
  status: varchar("status", { length: 20 }).default("active"), // 'active', 'completed', 'expired'
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  metadata: jsonb("metadata"),
});

export const questProgress = pgTable("quest_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  questId: uuid("quest_id").notNull().references(() => quests.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  contributionCo2eKg: decimal("contribution_co2e_kg", { precision: 10, scale: 2 }),
  actionDescription: varchar("action_description", { length: 255 }),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow(),
});

// ─── 5. FOREST & GAMEPLAY ───

export const forestTrees = pgTable("forest_trees", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  treeSpecies: varchar("tree_species", { length: 50 }).notNull(), // 'birch', 'oak', 'pine'
  reductionCategory: varchar("reduction_category", { length: 50 }).notNull(), // 'transport', 'diet', 'energy', 'shopping'
  co2eRepresentedKg: decimal("co2e_represented_kg", { precision: 10, scale: 2 }),
  positionX: integer("position_x").notNull(),
  positionY: integer("position_y").notNull(),
  isMilestone: boolean("is_milestone").default(false),
  wildlifeUnlocked: varchar("wildlife_unlocked", { length: 50 }),
  plantedAt: timestamp("planted_at", { withTimezone: true }).defaultNow(),
});

// ─── 6. STUB/SYSTEM TABLES ───

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  plan: varchar("plan", { length: 20 }).notNull(), // 'free', 'premium'
  status: varchar("status", { length: 20 }).notNull(), // 'active', 'cancelled'
  paymentProvider: varchar("payment_provider", { length: 20 }),
  externalSubscriptionId: varchar("external_subscription_id", { length: 255 }),
  price: decimal("price", { precision: 6, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("USD"),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }), // 'action_reminder', 'cohort_update'
  channel: varchar("channel", { length: 20 }), // 'in_app', 'email'
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  data: jsonb("data"),
  isRead: boolean("is_read").default(false),
  sentAt: timestamp("sent_at", { withTimezone: true }).defaultNow(),
  readAt: timestamp("read_at", { withTimezone: true }),
});

export const impactReports = pgTable("impact_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  totalCo2eReducedKg: decimal("total_co2e_reduced_kg", { precision: 14, scale: 2 }),
  fundAmountUsd: decimal("fund_amount_usd", { precision: 10, scale: 2 }),
  activeUserCount: integer("active_user_count"),
  projectAllocations: jsonb("project_allocations"),
  status: varchar("status", { length: 20 }).default("draft"), // 'draft', 'published'
  publishedAt: timestamp("published_at", { withTimezone: true }),
});

export const impactProjects = pgTable("impact_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").notNull().references(() => impactReports.id),
  partner: varchar("partner", { length: 100 }).notNull(), // e.g. 'Pachama'
  projectName: varchar("project_name", { length: 255 }).notNull(),
  certificateId: varchar("certificate_id", { length: 100 }),
  verificationUrl: varchar("verification_url", { length: 500 }),
  co2eOffsetKg: decimal("co2e_offset_kg", { precision: 12, scale: 2 }),
  areaProtectedAcres: decimal("area_protected_acres", { precision: 10, scale: 2 }),
  satelliteImageUrl: varchar("satellite_image_url", { length: 500 }),
  metadata: jsonb("metadata"),
});

// ─── RELATIONS DEFINITIONS FOR DRIZZLE ORM ───

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  preferences: one(userPreferences, {
    fields: [users.id],
    references: [userPreferences.userId],
  }),
  transactions: many(transactions),
  carbonRecords: many(carbonRecords),
  receiptScans: many(receiptScans),
  userActions: many(userActions),
  cohortMemberships: many(cohortMembers),
  forestTrees: many(forestTrees),
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
  notifications: many(notifications),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  category: one(merchantCategories, {
    fields: [transactions.categoryId],
    references: [merchantCategories.id],
  }),
  carbonRecords: many(carbonRecords),
}));

export const carbonRecordsRelations = relations(carbonRecords, ({ one }) => ({
  user: one(users, {
    fields: [carbonRecords.userId],
    references: [users.id],
  }),
  transaction: one(transactions, {
    fields: [carbonRecords.transactionId],
    references: [transactions.id],
  }),
  receiptItem: one(receiptItems, {
    fields: [carbonRecords.receiptItemId],
    references: [receiptItems.id],
  }),
  emissionFactor: one(emissionFactors, {
    fields: [carbonRecords.emissionFactorId],
    references: [emissionFactors.id],
  }),
}));

export const receiptScansRelations = relations(receiptScans, ({ one, many }) => ({
  user: one(users, {
    fields: [receiptScans.userId],
    references: [users.id],
  }),
  items: many(receiptItems),
}));

export const receiptItemsRelations = relations(receiptItems, ({ one, many }) => ({
  scan: one(receiptScans, {
    fields: [receiptItems.receiptScanId],
    references: [receiptScans.id],
  }),
  carbonRecords: many(carbonRecords),
}));

export const actionTiersRelations = relations(actionTiers, ({ many }) => ({
  actions: many(actions),
}));

export const actionsRelations = relations(actions, ({ one, many }) => ({
  tier: one(actionTiers, {
    fields: [actions.tierId],
    references: [actionTiers.id],
  }),
  userActions: many(userActions),
}));

export const userActionsRelations = relations(userActions, ({ one }) => ({
  user: one(users, {
    fields: [userActions.userId],
    references: [users.id],
  }),
  action: one(actions, {
    fields: [userActions.actionId],
    references: [actions.id],
  }),
}));

export const cohortsRelations = relations(cohorts, ({ many }) => ({
  members: many(cohortMembers),
  quests: many(quests),
}));

export const cohortMembersRelations = relations(cohortMembers, ({ one }) => ({
  cohort: one(cohorts, {
    fields: [cohortMembers.cohortId],
    references: [cohorts.id],
  }),
  user: one(users, {
    fields: [cohortMembers.userId],
    references: [users.id],
  }),
}));

export const questsRelations = relations(quests, ({ one, many }) => ({
  cohort: one(cohorts, {
    fields: [quests.cohortId],
    references: [cohorts.id],
  }),
  progress: many(questProgress),
}));

export const questProgressRelations = relations(questProgress, ({ one }) => ({
  quest: one(quests, {
    fields: [questProgress.questId],
    references: [quests.id],
  }),
  user: one(users, {
    fields: [questProgress.userId],
    references: [users.id],
  }),
}));

export const forestTreesRelations = relations(forestTrees, ({ one }) => ({
  user: one(users, {
    fields: [forestTrees.userId],
    references: [users.id],
  }),
}));
