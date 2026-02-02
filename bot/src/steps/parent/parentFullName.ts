import { askChildFullNameKz, askChildFullNameRu, errLanguageText, languageText } from "../../const/constante.text";
import { StepsUpdate } from "../../const/sesion";
import { parentsTable } from "../../db/schema";
import { StepHandler } from "../../types/stepContext";

export const handlerParentFullName: StepHandler = async ({
  client,
  chatId,
  text,
  db,
  rawText,
  s,
}) => {
  if (!s.data.parent) return;
  s.data.parent.fullname = rawText
  const parentFullName = s.data.parent.fullname
  const parentPhone = s.data.parent.phone
  const langData = s.meta.language
  const[created] = await db.insert(parentsTable).values({fullname: parentFullName, phone: parentPhone}).returning({id: parentsTable.id})
  s.meta.parentId = created.id
  const askChildFullName = langData === 'қазақша' ? askChildFullNameKz : askChildFullNameRu
  await client.sendMessage(chatId, askChildFullName, {sendSeen: false})
  s.step = StepsUpdate.childFullName
};
