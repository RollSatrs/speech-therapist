import { errDateKz, errDateRu, menuKz, menuRu } from "../../const/constante.text";
import { StepsUpdate } from "../../const/sesion";
import { childrenTable } from "../../db/schema";
import { isValidDate } from "../../tools/tools";
import { StepHandler } from "../../types/stepContext";

export const handlerchildAge: StepHandler = async ({
  client,
  chatId,
  text,
  s,
  db,
  rawText
}) => {
  const langData = s.meta.language
  if(!isValidDate(rawText)){
    const errDate = langData === 'қазақша' ? errDateKz : errDateRu
    await client.sendMessage(chatId, errDate, {sendSeen: false})
    return
  }
  s.data.child.age = rawText
  
  const childFullName = s.data.child.fullname
  const childLanguage = s.data.child.language
  const birthDate = s.data.child.age
  const parentId = s.meta.parentId
  if (!childFullName || !childLanguage || !parentId || !birthDate) {
  // можно отправить сообщение об ошибке или просто выйти
    return;
  }
  await db.insert(childrenTable).values({fullname: childFullName, birthDate: birthDate, language: childLanguage, parentId: parentId})
  const profileData = {
    parent:{
      fullName: s.data.parent.fullname,
      phone: s.data.parent.phone
    },
    child:{
      fullName: childFullName,
      birthDate: birthDate,
      language: childLanguage,
    }
  }
  const askMenu = langData === 'қазақша' ? menuKz(profileData): menuRu(profileData)
  await client.sendMessage(chatId, askMenu, {sendSeen: false})
  s.step = StepsUpdate.mainMenu
};
