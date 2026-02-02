import { askChildAgeKz, askChildLanguageKz, askChildLanguageRu, languageText } from "../../const/constante.text";
import { StepsUpdate } from "../../const/sesion";
import { StepHandler } from "../../types/stepContext";

export const handlerChildFullName: StepHandler = async ({
  client,
  chatId,
  text,
  s,
  db,
  rawText
}) => {
    s.data.child.fullname = rawText
    const langData = s.meta.language
    const askChildLanguage = langData === "қазақша" ? askChildLanguageKz: askChildLanguageRu
    await client.sendMessage(chatId, askChildLanguage, {sendSeen: false})
    s.step = StepsUpdate.childLanguage
    return
};
