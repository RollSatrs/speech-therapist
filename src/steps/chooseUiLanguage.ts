import { errLanguageText } from "../const/constante.text";
import { StepsUpdate } from "../const/sesion";
import { StepHandler } from "../types/stepContext";


export const handlerChooseUiLanguage: StepHandler = async ({
  client,
  chatId,
  text,
  db,
  rawText,
  s,
}) => {
    if(!['1', '2'].includes(text)){
      await client.sendMessage(chatId, errLanguageText, { sendSeen: false })
      return
    }
      const saveLang = text === "1" ? "русский" : 'қазақша'
      s.meta.language = saveLang
      s.step = StepsUpdate.parentPhone
};
