import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "down";
  let dbLatency = 0;

  try {
    // Perform a simple raw query to check database responsiveness
    await db.execute(sql`SELECT 1`);
    dbStatus = "up";
    dbLatency = Date.now() - startTime;
  } catch (error) {
    console.error("Health check database error:", error);
  }

  const status = dbStatus === "up" ? "healthy" : "unhealthy";

  return NextResponse.json(
    {
      status,
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      checks: {
        database: {
          status: dbStatus,
          latency_ms: dbLatency,
        },
      },
    },
    {
      status: status === "healthy" ? 200 : 503,
    }
  );
}
