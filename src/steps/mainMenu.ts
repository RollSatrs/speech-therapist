import { askChildFullNameKz, askChildFullNameRu } from "../const/constante.text";
import { StepsUpdate } from "../const/sesion";
import { StepHandler } from "../types/stepContext";

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
    const msg = langData === 'қазақша'
      ? 'Тест жақында қосылады.'
      : 'Тест скоро будет доступен.';
    await client.sendMessage(chatId, msg, { sendSeen: false });
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
