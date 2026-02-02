import { sql, and, gte, lte } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { parentsTable, sessionsTable } from "@/lib/db/schema";

export type RangeKey = "7d" | "30d";

export function getRangeDates(range: RangeKey) {
  const days = range === "7d" ? 7 : 30;
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  return { start, end, days };
}

export async function getSummary(range: RangeKey) {
  const db = getDb();
  const { start, end } = getRangeDates(range);

  const totalParents = await db
    .select({ count: sql<number>`count(*)` })
    .from(parentsTable);
  const newParents = await db
    .select({ count: sql<number>`count(*)` })
    .from(parentsTable)
    .where(and(gte(parentsTable.createdAt, start), lte(parentsTable.createdAt, end)));

  const completedSessions = await db
    .select({ count: sql<number>`count(*)` })
    .from(sessionsTable)
    .where(
      and(
        gte(sessionsTable.completedAt, start),
        lte(sessionsTable.completedAt, end)
      )
    );

  return {
    totalParents: totalParents[0]?.count ?? 0,
    newParents: newParents[0]?.count ?? 0,
    completedSessions: completedSessions[0]?.count ?? 0,
  };
}

export async function getDailyParents(range: RangeKey) {
  const db = getDb();
  const { start, end, days } = getRangeDates(range);

  const rows = await db.execute<{
    day: string;
    count: number;
  }>(
    sql`
      select to_char(date_trunc('day', ${parentsTable.createdAt}), 'YYYY-MM-DD') as day,
      count(*)::int as count
      from ${parentsTable}
      where ${parentsTable.createdAt} between ${start} and ${end}
      group by 1
      order by 1 asc
    `
  );

  const map = new Map(rows.rows.map((row) => [row.day, row.count]));
  const data: { day: string; count: number }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    data.push({ day: key, count: map.get(key) ?? 0 });
  }
  return data;
}
