import { and, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { test2_3 } from "../../const/tests/test2_3";
import { test3_4 } from "../../const/tests/test3_4";
import { test4_5 } from "../../const/tests/test4_5";
import { test5_7 } from "../../const/tests/test5_7";
import { answersTable, questionsTable, testsTable } from "../../db/schema";
import { TestType } from "../../interface/interface.sessions";

export type TestName = '2-3' | '3-4' | '4-5' | '5-7';

export type TestModule = {
  name: TestName;
  ageFrom: number;
  ageTo: number;
  test: TestType;
};

const testModules: Record<TestName, TestModule> = {
  '2-3': { name: '2-3', ageFrom: 2, ageTo: 3, test: test2_3 },
  '3-4': { name: '3-4', ageFrom: 3, ageTo: 4, test: test3_4 },
  '4-5': { name: '4-5', ageFrom: 4, ageTo: 5, test: test4_5 },
  '5-7': { name: '5-7', ageFrom: 5, ageTo: 7, test: test5_7 },
};

export function getTestModuleByAge(ageYears: number): TestModule | null {
  if (ageYears >= 2 && ageYears < 3) return testModules['2-3'];
  if (ageYears >= 3 && ageYears < 4) return testModules['3-4'];
  if (ageYears >= 4 && ageYears < 5) return testModules['4-5'];
  if (ageYears >= 5 && ageYears <= 7) return testModules['5-7'];
  return null;
}

export function getTestModuleByName(name: TestName): TestModule {
  return testModules[name];
}

export function getAgeYearsFromBirthDate(birthDate: string): number | null {
  const parts = birthDate.split('.');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map(Number);
  if (!dd || !mm || !yyyy) return null;
  const date = new Date(yyyy, mm - 1, dd);
  if (Number.isNaN(date.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  return age;
}

export function buildQuestionMessage(test: TestType, index: number, lang: 'ru' | 'kz'): string {
  const item = test.test[index];
  const questionText = lang === 'kz' ? item.question.kz : item.question.ru;
  const answers = item.answer
    .map((ans, i) => `${i + 1}️⃣ ${lang === 'kz' ? ans.text.kz : ans.text.ru}`)
    .join('\n');
  const hint = lang === 'kz' ? '\n\n*Жауапты 1, 2 немесе 3 санымен беріңіз*' : '\n\n*Ответьте цифрой 1, 2 или 3*';
  return `${questionText}\n\n${answers}${hint}`;
}

export async function ensureTestData(
  db: NodePgDatabase,
  module: TestModule
): Promise<{ testId: number; questionIds: number[] }> {
  const existingTest = await db
    .select()
    .from(testsTable)
    .where(and(eq(testsTable.name, module.name), eq(testsTable.ageFrom, module.ageFrom), eq(testsTable.ageTo, module.ageTo)))
    .limit(1);

  let testId = existingTest[0]?.id;
  if (!testId) {
    const inserted = await db
      .insert(testsTable)
      .values({ name: module.name, ageFrom: module.ageFrom, ageTo: module.ageTo })
      .returning({ id: testsTable.id });
    testId = inserted[0].id;
  }

  const questionIds: number[] = [];
  for (const q of module.test.test) {
    const existingQuestion = await db
      .select()
      .from(questionsTable)
      .where(and(eq(questionsTable.textId, testId), eq(questionsTable.textRu, q.question.ru)))
      .limit(1);

    let questionId = existingQuestion[0]?.id;
    if (!questionId) {
      const insertedQuestion = await db
        .insert(questionsTable)
        .values({
          textId: testId,
          textRu: q.question.ru,
          textKz: q.question.kz,
          textEn: q.question.en,
        })
        .returning({ id: questionsTable.id });
      questionId = insertedQuestion[0].id;
    }
    questionIds.push(questionId);

    const existingAnswers = await db
      .select()
      .from(answersTable)
      .where(eq(answersTable.questionId, questionId))
      .limit(1);

    if (!existingAnswers.length) {
      await db.insert(answersTable).values(
        q.answer.map((a) => ({
          questionId,
          textRu: a.text.ru,
          textKz: a.text.kz,
          textEn: a.text.en,
          points: a.point,
        }))
      );
    }
  }

  return { testId, questionIds };
}
