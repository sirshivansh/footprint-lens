import { db } from "@/db";
import { actions, userActions, carbonRecords, actionTiers, userProfiles } from "@/db/schema";
import { eq, and, sql, notInArray } from "drizzle-orm";

/**
 * Gets the current action recommendation for the user.
 * Implements hotspot calculation, tier locks, and dismissal tracking.
 */
export async function getCurrentAction(userId: string) {
  // 1. Get completed action count to determine tier progression
  const completed = await db
    .select({
      count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
    })
    .from(userActions)
    .where(and(eq(userActions.userId, userId), eq(userActions.status, "completed")));
  
  const completedCount = completed[0]?.count || 0;

  // Tier Lock Rules:
  // - completed < 5: Tier 1 only
  // - completed >= 5 and completed < 12: Tiers 1 and 2
  // - completed >= 12: Tiers 1, 2, and 3
  let maxTierLevel = 1;
  if (completedCount >= 12) maxTierLevel = 3;
  else if (completedCount >= 5) maxTierLevel = 2;

  // Fetch unlocked tiers
  const unlockedTiers = await db
    .select()
    .from(actionTiers)
    .where(sql`${actionTiers.tierLevel} <= ${maxTierLevel}`);
  
  const unlockedTierIds = unlockedTiers.map((t) => t.id);

  if (unlockedTierIds.length === 0) {
    // Fallback: If tiers aren't seeded yet, return null
    return null;
  }

  // 2. Identify top carbon hotspot category for the user (past 30 days)
  // Fallback to diet if no records exist
  let hotspotCategory = "diet";
  const past30Days = new Date();
  past30Days.setDate(past30Days.getDate() - 30);
  const formatted30Days = past30Days.toISOString().split("T")[0];

  const hotspots = await db
    .select({
      category: carbonRecords.category,
      total: sql<number>`SUM(CAST(${carbonRecords.co2eKg} AS DOUBLE PRECISION))`,
    })
    .from(carbonRecords)
    .where(
      and(
        eq(carbonRecords.userId, userId),
        sql`${carbonRecords.recordDate} >= ${formattedStartDate(past30Days)}`
      )
    )
    .groupBy(carbonRecords.category)
    .orderBy(sql`2 DESC`)
    .limit(1);

  if (hotspots.length > 0 && hotspots[0].category) {
    hotspotCategory = hotspots[0].category.toLowerCase();
  } else {
    // If no carbon records, check user profiles onboarding answers
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    
    if (profile) {
      if (profile.homeType === "house") hotspotCategory = "energy";
      else if (profile.primaryTransport === "car" || (profile.flightFrequency && profile.flightFrequency !== "0")) hotspotCategory = "transport";
      else if (profile.shoppingHabit === "frequent") hotspotCategory = "shopping";
      else if (profile.dietType === "omnivore") hotspotCategory = "diet";
    }
  }

  // 3. Find already completed or retired actions for the user
  const excludedUserActions = await db
    .select({
      actionId: userActions.actionId,
    })
    .from(userActions)
    .where(
      and(
        eq(userActions.userId, userId),
        sql`${userActions.status} IN ('completed', 'retired')`
      )
    );
  
  const excludedIds = excludedUserActions.map((ua) => ua.actionId);

  // 4. Fetch all available actions in unlocked tiers
  let actionsQuery = db
    .select({
      id: actions.id,
      title: actions.title,
      description: actions.description,
      impactDescription: actions.impactDescription,
      category: actions.category,
      estimatedCo2eReductionKg: actions.estimatedCo2eReductionKg,
      feasibilityScore: actions.feasibilityScore,
      tierId: actions.tierId,
    })
    .from(actions)
    .where(
      and(
        eq(actions.isActive, true),
        sql`${actions.tierId} IN (${sql.raw(
          unlockedTierIds.map((id) => `'${id}'`).join(",")
        )})`
      )
    );

  const availableActions = await actionsQuery;

  // Filter out excluded actions manually (to handle empty array edge cases cleanly in SQL)
  const filteredActions = availableActions.filter((act) => !excludedIds.includes(act.id));

  if (filteredActions.length === 0) {
    // If all unlocked actions are completed/retired, just return a fallback from all actions
    const fallbackAct = availableActions[0];
    if (!fallbackAct) return null;
    const tierInfo = unlockedTiers.find((t) => t.id === fallbackAct.tierId);
    return {
      id: fallbackAct.id,
      title: fallbackAct.title,
      description: fallbackAct.description,
      impactDescription: fallbackAct.impactDescription,
      category: fallbackAct.category,
      estimatedCo2eReductionKg: parseFloat(fallbackAct.estimatedCo2eReductionKg || "0"),
      tier: tierInfo
        ? {
            name: tierInfo.name,
            level: tierInfo.tierLevel,
            icon: tierInfo.icon || "🟢",
            color: tierInfo.color || "#5B8C5A",
          }
        : null,
    };
  }

  // 5. Rank remaining actions
  // Formula: Score = Reduction × Feasibility. Boost by 1.5 if matches hotspot category.
  const scoredActions = filteredActions.map((act) => {
    const reduction = parseFloat(act.estimatedCo2eReductionKg || "1.0");
    const feasibility = act.feasibilityScore || 50;
    
    let score = reduction * feasibility;
    if (act.category.toLowerCase() === hotspotCategory.toLowerCase()) {
      score *= 1.5; // Boost hotspot category
    }

    return {
      action: act,
      score,
    };
  });

  // Sort descending
  scoredActions.sort((a, b) => b.score - a.score);

  // Return highest scoring action
  const bestAction = scoredActions[0].action;

  // Get tier information for response
  const tierInfo = unlockedTiers.find((t) => t.id === bestAction.tierId);

  return {
    id: bestAction.id,
    title: bestAction.title,
    description: bestAction.description,
    impactDescription: bestAction.impactDescription,
    category: bestAction.category,
    estimatedCo2eReductionKg: parseFloat(bestAction.estimatedCo2eReductionKg || "0"),
    tier: tierInfo
      ? {
          name: tierInfo.name,
          level: tierInfo.tierLevel,
          icon: tierInfo.icon || "🟢",
          color: tierInfo.color || "#5B8C5A",
        }
      : null,
  };
}

function formattedStartDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
