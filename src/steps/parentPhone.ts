import { eq } from "drizzle-orm";
import { errLanguageText, invalidPhoneKz, invalidPhoneRu, menuKz, menuRu, noChildProfileKz, noChildProfileRu } from "../const/constante.text";
import { StepsUpdate } from "../const/sesion";
import { childrenTable, parentsTable } from "../db/schema";
import { isValidPhone, normalizePhone } from "../tools/tools";
import { StepHandler } from "../types/stepContext";

export const handlerParentPhone: StepHandler = async ({
  client,
  chatId,
  text,
  db,
  rawText,
  s,
}) => {
  const langData = s.meta.language
  const phone = normalizePhone(rawText)
  if(!isValidPhone(phone)){
    const errText = langData === "қазақша" ? invalidPhoneKz : invalidPhoneRu
    await client.sendMessage(chatId, errText, { sendSeen: false })
    return
  }
  const foundParent = await db.select().from(parentsTable).where(eq(parentsTable.phone, phone)).limit(1)
  if(foundParent.length){
    const parentData = foundParent[0]
    const {id, fullname, phone} = parentData
    const parentId = id
    const parentFullName = fullname
    const parentPhone = phone
    s.meta.parentId = parentId
    const foundChild = await db.select().from(childrenTable).where(eq(childrenTable.parentId, parentId))
    if(foundChild.length){
      const childrenData = foundChild[0]
      const {id, fullname, language, birthDate} = childrenData
      const childId = id
      const childFullName = fullname
      const childLanguage = language
      const childBithDate = birthDate
      s.meta.child = childId
      const profileData = {
        parent: {
          fullName: parentFullName,
          phone: parentPhone,
        },
        child: {
          fullName: childFullName,
          birthDate: childBithDate,
          language: childLanguage,
        },
      };
      const menuText = langData === 'қазақша' ? menuKz(profileData) : menuRu(profileData) 
      await client.sendMessage(chatId, menuText, { sendSeen: false })
      s.step = StepsUpdate.mainMenu
    }else{
      const noChildText = langData === 'қазақша' ? noChildProfileKz(parentFullName, parentPhone) : noChildProfileRu(parentFullName, parentPhone) 
      await client.sendMessage(chatId, noChildText, { sendSeen: false })
      s.step = StepsUpdate.childPickOrCreate
    }
  }else{
    'скоро начну делать'
  }
};
