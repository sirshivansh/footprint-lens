import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db } from "@/db";
import { receiptScans, receiptItems, carbonRecords } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const scanItemSchema = z.object({
  itemName: z.string(),
  quantity: z.number().default(1),
  unit: z.string().optional(),
  price: z.number().optional(),
  impactLevel: z.enum(["low", "moderate", "high"]),
  co2eKg: z.number(),
  suggestedSwap: z.string().nullable().optional(),
  swapCo2eKg: z.number().nullable().optional(),
});

export const receiptsRouter = router({
  saveScan: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string(),
        items: z.array(scanItemSchema),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // 1. Insert receipt scan record
      const [scan] = await db
        .insert(receiptScans)
        .values({
          userId,
          imageUrl: input.imageUrl,
          ocrProvider: "tesseract",
          status: "completed",
        })
        .returning();

      const itemsToInsert = input.items.map((item) => ({
        receiptScanId: scan.id,
        itemName: item.itemName,
        quantity: item.quantity.toString(),
        unit: item.unit || "unit",
        price: item.price ? item.price.toString() : null,
        impactLevel: item.impactLevel,
        co2eKg: item.co2eKg.toString(),
        suggestedSwap: item.suggestedSwap || null,
        swapCo2eKg: item.swapCo2eKg ? item.swapCo2eKg.toString() : null,
      }));

      // 2. Insert items
      const insertedItems = await db.insert(receiptItems).values(itemsToInsert).returning();

      // 3. Create carbon record for each item to update overall user carbon footprint
      const carbonRecordsToInsert = insertedItems.map((item) => ({
        userId,
        receiptItemId: item.id,
        sourceType: "receipt",
        co2eKg: item.co2eKg || "0.00",
        category: "diet", // grocery scans default to diet
        subcategory: "groceries",
        recordDate: new Date().toISOString().split("T")[0],
        calculationDetails: {
          itemName: item.itemName,
          impactLevel: item.impactLevel,
        },
      }));

      if (carbonRecordsToInsert.length > 0) {
        await db.insert(carbonRecords).values(carbonRecordsToInsert);
      }

      return {
        success: true,
        scanId: scan.id,
      };
    }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Fetch user scans
    const scansList = await db
      .select()
      .from(receiptScans)
      .where(eq(receiptScans.userId, userId))
      .orderBy(desc(receiptScans.scannedAt));

    // For each scan, fetch items
    const history = [];
    for (const scan of scansList) {
      const items = await db
        .select()
        .from(receiptItems)
        .where(eq(receiptItems.receiptScanId, scan.id));

      const totalCo2 = items.reduce((sum, item) => sum + parseFloat(item.co2eKg || "0"), 0);
      const potentialCo2 = items.reduce((sum, item) => {
        const itemCo2 = parseFloat(item.co2eKg || "0");
        const swapCo2 = item.swapCo2eKg ? parseFloat(item.swapCo2eKg) : itemCo2;
        return sum + swapCo2;
      }, 0);

      history.push({
        id: scan.id,
        imageUrl: scan.imageUrl,
        scannedAt: scan.scannedAt,
        status: scan.status,
        items: items.map((item) => ({
          itemName: item.itemName,
          quantity: parseFloat(item.quantity || "1"),
          price: item.price ? parseFloat(item.price) : null,
          co2eKg: parseFloat(item.co2eKg || "0"),
          impactLevel: item.impactLevel || "low",
          suggestedSwap: item.suggestedSwap,
          swapCo2eKg: item.swapCo2eKg ? parseFloat(item.swapCo2eKg) : null,
        })),
        totalCo2eKg: Number(totalCo2.toFixed(1)),
        potentialCo2eKg: Number(potentialCo2.toFixed(1)),
        potentialReductionPercent:
          totalCo2 > 0 ? Number((((totalCo2 - potentialCo2) / totalCo2) * 100).toFixed(1)) : 0,
      });
    }

    return history;
  }),
});
