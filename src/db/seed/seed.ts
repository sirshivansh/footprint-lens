import { db } from "../index";
import { actionTiers, actions, emissionFactors, merchantCategories } from "../schema";
import { seedActionTiers, seedActions } from "./action-library";
import { seedEmissionFactors } from "./emission-factors";
import { seedMerchantCategories } from "./merchant-categories";

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Delete dependent tables first to respect foreign keys
    console.log("Clearing existing seed data...");
    await db.delete(actions);
    await db.delete(actionTiers);
    await db.delete(emissionFactors);
    await db.delete(merchantCategories);

    console.log("Inserting action tiers...");
    for (const tier of seedActionTiers) {
      await db.insert(actionTiers).values(tier);
    }

    const insertedTiers = await db.select().from(actionTiers);

    console.log("Inserting actions...");
    for (const action of seedActions) {
      const tier = insertedTiers.find((t) => t.tierLevel === action.tierLevel);
      if (!tier) continue;
      
      const { tierLevel, ...actionData } = action;
      await db.insert(actions).values({
        ...actionData,
        tierId: tier.id,
      });
    }

    console.log("Inserting emission factors...");
    for (const ef of seedEmissionFactors) {
      await db.insert(emissionFactors).values(ef);
    }

    console.log("Inserting merchant categories...");
    for (const mc of seedMerchantCategories) {
      await db.insert(merchantCategories).values(mc);
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
export {};
