import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, queryClient } from "./index";

async function runMigrations() {
  if (!queryClient) {
    console.error("❌ Cannot run migrations: DATABASE_URL is not configured.");
    process.exit(1);
  }

  console.log("⏳ Running database migrations from src/db/migrations...");
  try {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("✅ Database migrations applied successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await queryClient.end();
  }
}

runMigrations();
