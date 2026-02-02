import { eq, inArray } from "drizzle-orm";
import { Topbar } from "@/components/admin/topbar";
import { getDb } from "@/lib/db/client";
import { answersTable, questionsTable, testsTable } from "@/lib/db/schema";
import TestEditClient from "./test-edit-client";

export default async function EditTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  const id = Number(resolved.id);
  const db = getDb();
  const tests = await db
    .select()
    .from(testsTable)
    .where(eq(testsTable.id, id))
    .limit(1);
  const test = tests[0];
  if (!test) {
    return (
      <div className="flex flex-col gap-8">
        <Topbar title="Тест не найден" />
      </div>
    );
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
  const byQuestion = new Map<number, typeof answers>();
  for (const answer of answers) {
    const list = byQuestion.get(answer.questionId) ?? [];
    list.push(answer);
    byQuestion.set(answer.questionId, list);
  }

  const initial = {
    name: test.name,
    ageFrom: test.ageFrom,
    ageTo: test.ageTo,
    questions: questions.map((q) => ({
      id: q.id,
      textRu: q.textRu,
      textKz: q.textKz,
      textEn: q.textEn ?? "",
      answers: (byQuestion.get(q.id) ?? []).map((a) => ({
        id: a.id,
        textRu: a.textRu,
        textKz: a.textKz,
        textEn: a.textEn ?? "",
        points: a.points,
      })),
    })),
  };

  return (
    <div className="flex flex-col gap-8">
      <Topbar title="Редактирование теста" subtitle={test.name} />
      <TestEditClient testId={id} initial={initial} />
    </div>
  );
}
