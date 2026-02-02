import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { ensureTestData, type TestModule } from "../steps/test/testHelpers";
import { test2_3 } from "../const/tests/test2_3";
import { test3_4 } from "../const/tests/test3_4";
import { test4_5 } from "../const/tests/test4_5";
import { test5_7 } from "../const/tests/test5_7";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  const modules: TestModule[] = [
    { name: "2-3", ageFrom: 2, ageTo: 3, test: test2_3 },
    { name: "3-4", ageFrom: 3, ageTo: 4, test: test3_4 },
    { name: "4-5", ageFrom: 4, ageTo: 5, test: test4_5 },
    { name: "5-7", ageFrom: 5, ageTo: 7, test: test5_7 },
  ];

  for (const module of modules) {
    await ensureTestData(db, module);
  }

  await pool.end();
  console.log("✅ Tests seeded into database.");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
