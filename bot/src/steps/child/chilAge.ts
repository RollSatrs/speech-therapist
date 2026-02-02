import { errDateKz, errDateRu, menuKz, menuRu } from "../../const/constante.text";
import { StepsUpdate } from "../../const/sesion";
import { childrenTable } from "../../db/schema";
import { isValidDate } from "../../tools/tools";
import { StepHandler } from "../../types/stepContext";

function formatChildLanguageLabel(
  childLanguage: string,
  uiLang: 'ru' | 'kz'
): string {
  if (childLanguage === 'russian') return uiLang === 'kz' ? 'Орысша' : 'Русский';
  if (childLanguage === 'kazakh') return uiLang === 'kz' ? 'Қазақша' : 'Казахский';
  if (childLanguage === 'bilingual') return uiLang === 'kz' ? 'Екі тілде' : 'На двух языках';
  return childLanguage;
}

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
  const dbLanguage =
    childLanguage === 'russian' ? 'ru' :
    childLanguage === 'kazakh' ? 'kz' :
    'both';
  const [day, month, year] = birthDate.split('.');
  const dbBirthDate = `${year}-${month}-${day}`;
  const insertedChild = await db
    .insert(childrenTable)
    .values({ fullname: childFullName, birthDate: dbBirthDate, language: dbLanguage, parentId: parentId })
    .returning({ id: childrenTable.id });
  if (insertedChild[0]?.id) {
    s.meta.child = insertedChild[0].id;
  }
  const childLanguageLabel = formatChildLanguageLabel(childLanguage, langData === 'қазақша' ? 'kz' : 'ru');
  const profileData = {
    parent:{
      fullName: s.data.parent.fullname,
      phone: s.data.parent.phone
    },
    child:{
      fullName: childFullName,
      birthDate: birthDate,
      language: childLanguageLabel,
    }
  }
  const askMenu = langData === 'қазақша' ? menuKz(profileData): menuRu(profileData)
  await client.sendMessage(chatId, askMenu, {sendSeen: false})
  s.step = StepsUpdate.mainMenu
};
