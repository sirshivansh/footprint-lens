import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  // During build time or server startup without DB URL, we don't want to crash.
  // We'll export a mock client if DATABASE_URL is missing, but log a warning.
  console.warn("⚠️ DATABASE_URL environment variable is missing. Database queries will fail.");
}

const sql = neon(process.env.DATABASE_URL || "postgresql://db_user:db_pass@dummy-host.neon.tech/footprint-lens");
export const db = drizzle(sql, { schema });
export type DbClient = typeof db;
