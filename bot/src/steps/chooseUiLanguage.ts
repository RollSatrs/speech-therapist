import { askParentPhoneKz, askParentPhoneRu, errLanguageText, languageText } from "../const/constante.text";
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
      const askPhone = saveLang === "қазақша" ? askParentPhoneKz : askParentPhoneRu;
      
      await client.sendMessage(chatId, askPhone, {sendSeen: false})
      s.step = StepsUpdate.parentPhone
};
