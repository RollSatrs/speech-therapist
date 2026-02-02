import { languageText } from "../const/constante.text";
import { StepsUpdate } from "../const/sesion";
import { StepHandler } from "../types/stepContext";

export const handlerIdle: StepHandler = async ({
  client,
  chatId,
  text,
  s,
}) => {
  if (["старт", "бастау"].includes(text)) {
    await client.sendMessage(chatId, languageText, {sendSeen: false});
    s.step = StepsUpdate.chooseUiLanguage;
  }
};
