import { askChildFullNameKz, askChildFullNameRu, errAgeRangeKz, errAgeRangeRu } from "../const/constante.text";
import { StepsUpdate } from "../const/sesion";
import { sessionsTable } from "../db/schema";
import { getActiveLanguageSystem } from "../tools/tools";
import { StepHandler } from "../types/stepContext";
import { buildQuestionMessage, ensureTestData, getAgeYearsFromBirthDate, getTestModuleByAge } from "./test/testHelpers";

export const handlerMainMenu: StepHandler = async ({
  client,
  chatId,
  text,
  s,
  db,
  rawText
}) => {
  if (!['1', '2', '3'].includes(text)) {
    await client.sendMessage(chatId, 'Пожалуйста, выберите цифру 1, 2 или 3', { sendSeen: false });
    return;
  }

  const langData = s.meta.language;

  if (text === '1') {
    const birthDate = s.data.child.age;
    const ageYears = birthDate ? getAgeYearsFromBirthDate(birthDate) : null;
    if (ageYears === null) {
      const msg = langData === 'қазақша'
        ? 'Алдымен баланың туған күнін дұрыс енгізіңіз.'
        : 'Сначала правильно укажите дату рождения ребёнка.';
      await client.sendMessage(chatId, msg, { sendSeen: false });
      return;
    }

    const module = getTestModuleByAge(ageYears);
    if (!module) {
      const msg = langData === 'қазақша' ? errAgeRangeKz : errAgeRangeRu;
      await client.sendMessage(chatId, msg, { sendSeen: false });
      return;
    }

    if (!s.meta.parentId || !s.meta.child) {
      const msg = langData === 'қазақша'
        ? 'Алдымен ата-ана мен бала туралы деректерді толтырыңыз.'
        : 'Сначала заполните данные родителя и ребёнка.';
      await client.sendMessage(chatId, msg, { sendSeen: false });
      return;
    }

    const { testId, questionIds } = await ensureTestData(db, module);
    const insertedSession = await db
      .insert(sessionsTable)
      .values({
        testId,
        parentId: s.meta.parentId,
        childrenId: s.meta.child,
        chatId,
      })
      .returning({ id: sessionsTable.id });

    s.meta.sessionId = insertedSession[0]?.id;
    s.meta.test = {
      testId,
      testName: module.name,
      questionIds,
      questionIndex: 0,
      score: 0,
    };

    const uiLang = getActiveLanguageSystem(langData ?? 'русский');
    const questionLang = uiLang === 'kz' ? 'kz' : 'ru';
    const firstQuestion = buildQuestionMessage(module.test, 0, questionLang);
    await client.sendMessage(chatId, firstQuestion, { sendSeen: false });
    s.step = StepsUpdate.testQuestion;
    return;
  }

  if (text === '2') {
    const askChildFullName = langData === 'қазақша' ? askChildFullNameKz : askChildFullNameRu;
    await client.sendMessage(chatId, askChildFullName, { sendSeen: false });
    s.step = StepsUpdate.childFullName;
    return;
  }

  const msg = langData === 'қазақша'
    ? 'Мәліметтерді өңдеу жақында қолжетімді болады.'
    : 'Редактирование данных скоро будет доступно.';
  await client.sendMessage(chatId, msg, { sendSeen: false });
};
