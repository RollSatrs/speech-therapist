import { askChildAgeKz, askChildAgeRu, askChildBirthDateKz, askChildBirthDateRu } from "../../const/constante.text";
import { StepsUpdate } from "../../const/sesion";
import { childLanguageType } from "../../interface/interface.sessions";
import { StepHandler } from "../../types/stepContext";

export const handlerChildLanguage: StepHandler = async ({
  client,
  chatId,
  text,
  s,
  db,
  rawText
}) => {
  if(!['1', '2', '3'].includes(text)){
    await client.sendMessage(chatId, 'Пожалуйста, выберите цифру 1, 2 или 3', {sendSeen:false})
    return
  }
  let chooseLanguage: childLanguageType
  const langData = s.meta.language
  if('1' === text) chooseLanguage = 'russian'
  else if('2' === text) chooseLanguage = 'kazakh'
  else chooseLanguage = 'bilingual'
  s.data.child.language = chooseLanguage
  const askAge = langData === 'қазақша' ? askChildBirthDateKz : askChildBirthDateRu
  await client.sendMessage(chatId, askAge, {sendSeen: false})
  s.step = StepsUpdate.childAge
};
