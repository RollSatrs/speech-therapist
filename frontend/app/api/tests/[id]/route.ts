import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { answersTable, questionsTable, testsTable } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/api-guard";
import { testSchema } from "@/lib/validators";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = getDb();
  const tests = await db
    .select()
    .from(testsTable)
    .where(eq(testsTable.id, id))
    .limit(1);
  const test = tests[0];
  if (!test) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const questions = await db
    .select()
    .from(questionsTable)
    .where(eq(questionsTable.textId, id));

  const questionIds = questions.map((q) => q.id);
  const answers = questionIds.length
    ? await db
        .select()
        .from(answersTable)
        .where(inArray(answersTable.questionId, questionIds))
    : [];

  const byQuestion = new Map<number, typeof answers>([
    ...questionIds.map((qid) => [qid, [] as typeof answers]),
  ]);
  for (const answer of answers) {
    const list = byQuestion.get(answer.questionId) ?? [];
    list.push(answer);
    byQuestion.set(answer.questionId, list);
  }

  return NextResponse.json({
    id: test.id,
    name: test.name,
    ageFrom: test.ageFrom,
    ageTo: test.ageTo,
    questions: questions.map((q) => ({
      id: q.id,
      textRu: q.textRu,
      textKz: q.textKz,
      textEn: q.textEn,
      answers: (byQuestion.get(q.id) ?? []).map((a) => ({
        id: a.id,
        textRu: a.textRu,
        textKz: a.textKz,
        textEn: a.textEn,
        points: a.points,
      })),
    })),
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const payload = await request.json();
  const parsed = testSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const db = getDb();
  const { name, ageFrom, ageTo, questions } = parsed.data;

  await db.transaction(async (tx) => {
    await tx
      .update(testsTable)
      .set({ name, ageFrom, ageTo, updatedAt: new Date() })
      .where(eq(testsTable.id, id));

    for (const q of questions) {
      let questionId = q.id;
      if (questionId) {
        await tx
          .update(questionsTable)
          .set({
            textRu: q.textRu,
            textKz: q.textKz,
            textEn: q.textEn ?? null,
          })
          .where(eq(questionsTable.id, questionId));
      } else {
        const [created] = await tx
          .insert(questionsTable)
          .values({
            textId: id,
            textRu: q.textRu,
            textKz: q.textKz,
            textEn: q.textEn ?? null,
          })
          .returning({ id: questionsTable.id });
        questionId = created.id;
      }

      for (const a of q.answers) {
        if (a.id) {
          await tx
            .update(answersTable)
            .set({
              textRu: a.textRu,
              textKz: a.textKz,
              textEn: a.textEn ?? null,
              points: a.points,
            })
            .where(eq(answersTable.id, a.id));
        } else {
          await tx.insert(answersTable).values({
            questionId,
            textRu: a.textRu,
            textKz: a.textKz,
            textEn: a.textEn ?? null,
            points: a.points,
          });
        }
      }
    }
  });

  return NextResponse.json({ ok: true });
}
