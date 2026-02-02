import { and, eq } from "drizzle-orm";
import { errTestAnswerKz, errTestAnswerRu, menuKz, menuRu } from "../../const/constante.text";
import { StepsUpdate } from "../../const/sesion";
import { getResultTextKz, getResultTextRu } from "../../const/testResults";
import { answersTable, sessonAnswerTable, sessionsTable } from "../../db/schema";
import { getActiveLanguageSystem } from "../../tools/tools";
import { StepHandler } from "../../types/stepContext";
import { buildQuestionMessage, getTestModuleByName } from "./testHelpers";

function formatChildLanguageLabel(
  childLanguage: string,
  uiLang: 'ru' | 'kz'
): string {
  if (childLanguage === 'russian') return uiLang === 'kz' ? 'Орысша' : 'Русский';
  if (childLanguage === 'kazakh') return uiLang === 'kz' ? 'Қазақша' : 'Казахский';
  if (childLanguage === 'bilingual') return uiLang === 'kz' ? 'Екі тілде' : 'На двух языках';
  if (childLanguage === 'ru') return uiLang === 'kz' ? 'Орысша' : 'Русский';
  if (childLanguage === 'kz') return uiLang === 'kz' ? 'Қазақша' : 'Казахский';
  if (childLanguage === 'both') return uiLang === 'kz' ? 'Екі тілде' : 'На двух языках';
  return childLanguage;
}

export const handlerTestQuestion: StepHandler = async ({
  client,
  chatId,
  text,
  s,
  db,
}) => {
  const testState = s.meta.test;
  if (!testState) return;

  if (!['1', '2', '3'].includes(text)) {
    const err = s.meta.language === 'қазақша' ? errTestAnswerKz : errTestAnswerRu;
    await client.sendMessage(chatId, err, { sendSeen: false });
    return;
  }

  const uiLang = getActiveLanguageSystem(s.meta.language ?? 'русский');
  const questionLang = uiLang === 'kz' ? 'kz' : 'ru';
  const module = getTestModuleByName(testState.testName);
  const test = module.test;
  const questionIndex = testState.questionIndex;
  const question = test.test[questionIndex];

  const choiceIndex = Number(text) - 1;
  const selectedAnswer = question.answer[choiceIndex];
  const points = selectedAnswer.point;
  testState.score += points;

  const sessionId = s.meta.sessionId;
  const questionId = testState.questionIds[questionIndex];
  if (sessionId && questionId) {
    const answerRow = await db
      .select()
      .from(answersTable)
      .where(and(eq(answersTable.questionId, questionId), eq(answersTable.points, points)))
      .limit(1);
    const answerId = answerRow[0]?.id;
    if (answerId) {
      const answerText = questionLang === 'kz' ? selectedAnswer.text.kz : selectedAnswer.text.ru;
      await db.insert(sessonAnswerTable).values({
        sessonId: sessionId,
        questionId,
        answerId,
        answerText,
      });
    }
  }

  testState.questionIndex += 1;
  if (testState.questionIndex < test.test.length) {
    const nextMsg = buildQuestionMessage(test, testState.questionIndex, questionLang);
    await client.sendMessage(chatId, nextMsg, { sendSeen: false });
    return;
  }

  if (sessionId) {
    await db
      .update(sessionsTable)
      .set({ completedAt: new Date() })
      .where(eq(sessionsTable.id, sessionId));
  }

  const resultText =
    questionLang === 'kz'
      ? getResultTextKz(testState.testName, testState.score)
      : getResultTextRu(testState.testName, testState.score);
  await client.sendMessage(chatId, resultText, { sendSeen: false });

  const childLanguageLabel = formatChildLanguageLabel(s.data.child.language, questionLang);
  const profileData = {
    parent: {
      fullName: s.data.parent.fullname,
      phone: s.data.parent.phone,
    },
    child: {
      fullName: s.data.child.fullname,
      birthDate: s.data.child.age,
      language: childLanguageLabel,
    },
  };
  const menuText = questionLang === 'kz' ? menuKz(profileData) : menuRu(profileData);
  await client.sendMessage(chatId, menuText, { sendSeen: false });

  s.step = StepsUpdate.mainMenu;
  s.meta.test = undefined;
};
