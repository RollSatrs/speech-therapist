import { NextResponse } from "next/server";
import { sql, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { answersTable, questionsTable, testsTable } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/api-guard";
import { testSchema } from "@/lib/validators";

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = getDb();
  const rows = await db.execute<{
    id: number;
    name: string;
    ageFrom: number;
    ageTo: number;
    questionCount: number;
  }>(
    sql`
      select t.id, t.name, t.age_from as "ageFrom", t.age_to as "ageTo",
      count(q.id)::int as "questionCount"
      from ${testsTable} t
      left join ${questionsTable} q on q.text_id = t.id
      group by t.id
      order by t.created_at desc
    `
  );
  return NextResponse.json(rows.rows);
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await request.json();
  const parsed = testSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const db = getDb();
  const { name, ageFrom, ageTo, questions } = parsed.data;

  const result = await db.transaction(async (tx) => {
    const [test] = await tx
      .insert(testsTable)
      .values({ name, ageFrom, ageTo })
      .returning({ id: testsTable.id });

    for (const q of questions) {
      const [question] = await tx
        .insert(questionsTable)
        .values({
          textId: test.id,
          textRu: q.textRu,
          textKz: q.textKz,
          textEn: q.textEn ?? null,
        })
        .returning({ id: questionsTable.id });

      await tx.insert(answersTable).values(
        q.answers.map((a) => ({
          questionId: question.id,
          textRu: a.textRu,
          textKz: a.textKz,
          textEn: a.textEn ?? null,
          points: a.points,
        }))
      );
    }

    return test.id;
  });

  return NextResponse.json({ id: result });
}
