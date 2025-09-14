import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL missing");
  const ssl = process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined;

  const pool = new Pool({ connectionString, ssl, max: 1 });
  try {
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("✅ Migrations complete");
  } finally {
    await pool.end();
  }
}
main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
