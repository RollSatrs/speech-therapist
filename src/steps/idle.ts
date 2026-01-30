import { StepsUpdate } from "../const/sesion";
import { StepHandler } from "../types/stepContext";

export const handlerIdle: StepHandler = async ({
  client,
  chatId,
  text,
  s,
}) => {
  if (["старт", "бастау"].includes(text)) {
    await client.sendMessage(chatId, "Выберите язык");
    s.step = StepsUpdate.chooseUiLanguage;
  }
};



