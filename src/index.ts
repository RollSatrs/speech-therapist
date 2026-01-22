import pkg from 'whatsapp-web.js';
import QRCode from 'qrcode';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import {askChildAgeEn, 
  askChildAgeKz, askChildAgeRu, 
  askChildFullNameEn, askChildFullNameKz, 
  askChildFullNameRu, askChildLanguageEn, askChildLanguageKz, askChildLanguageRu, askParentNameEn, 
  askParentNameKz, askParentNameRu, 
  askParentPhoneEn, askParentPhoneKz, 
  askParentPhoneRu, languageText,  
  welcomeEn, welcomeKz, welcomeRu } from './const/constante.text';
import { session } from './const/sesion';
import { childLanguageType, childAgeType, Steps, language, ageMap } from './interface/interface.sessions';
import { getTestByAge } from './tools/tools';

const { Client, LocalAuth } = pkg;

const db = drizzle(process.env.DATABASE_URL!);

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

client.on('qr', async (qr: string) => {
  console.log('QR получен, отсканируйте в WhatsApp:');
  try {
    const qrTerminal = await QRCode.toString(qr, { type: 'terminal', small: true });
    console.log(qrTerminal);
  } catch (err) {
    console.error('Ошибка при генерации QR:', err);
  }
});

client.on('ready', () => {
  console.log('✅ WhatsApp бот готов!');
});

client.on('message', async (msg) => {
  const chatId = msg.from;
  const rawText = msg.body
  const text = rawText.toLowerCase();

  if (!session[chatId]) {
    console.log('sesion')
    session[chatId] = {
      step: 'start',
      meta: {},
      data: {}
    };
  }
  const sessions = session[chatId]
  const lang = sessions.meta?.language
  if(sessions.step === Steps.start){
    if(text === 'старт'){
      await client.sendMessage(chatId, languageText, {sendSeen: false})
      sessions.step = Steps.language.choose
      return
    }
  }

  sessions.data ??= {}

  if(sessions.step == Steps.language.choose){
    if (!['русский', 'қазақша', 'english'].includes(text)) return;
    sessions.meta ??= {}
    sessions.meta.language = text as any
    const welcome = 
      text === 'русский'? welcomeRu:
      text === 'қазақша'? welcomeKz:
      welcomeEn

    await client.sendMessage(chatId, welcome, {sendSeen: false})
    sessions.step = Steps.language.waitStart
    console.log('Welcomdd',text)
  }

  if(sessions.step === Steps.language.waitStart){
    if (!['начать тест', 'тесті бастау', 'start test'].includes(text)) return;

    const askParentName =
      lang === 'русский'? askParentNameRu:
      lang === 'қазақша'? askParentNameKz:
      askParentPhoneEn
  
    await client.sendMessage(chatId, askParentName, {sendSeen: false})

    sessions.step = Steps.parentInfo.waitFullName
    return
  }

  if(sessions.step == Steps.parentInfo.waitFullName){
    sessions.data.parent ??= {}
    sessions.data.parent.fullname = rawText

    const askParentPhone = 
      lang === 'русский'? askParentPhoneRu:
      lang === 'қазақша'? askParentPhoneKz:
      askParentPhoneEn
    

    await client.sendMessage(chatId, askParentPhone, {sendSeen: false})
    sessions.step = Steps.parentInfo.waitPhone
    return
  }

  if(sessions.step === Steps.parentInfo.waitPhone){
    sessions.data.parent ??= {}
    sessions.data.parent.phone = text
    const askChildFullName =
      lang === 'русский'? askChildFullNameRu:
      lang === 'қазақша'? askChildFullNameKz:
      askChildFullNameEn

      await client.sendMessage(chatId, askChildFullName, {sendSeen: false})
      sessions.step = Steps.childInfo.waitFullName
      return
    }

  if(sessions.step === Steps.childInfo.waitFullName){
    sessions.data.child ??= {}
    sessions.data.child.fullname = rawText

    const askChildLanguage =
      lang === 'русский'? askChildLanguageRu:
      lang === 'қазақша'? askChildLanguageKz:
      askChildLanguageEn
    await client.sendMessage(chatId, askChildLanguage, {sendSeen: false})
    sessions.step = Steps.childInfo.waitLanguage
    return
  }
  

  if(sessions.step === Steps.childInfo.waitLanguage){
    if (!['1', '2', '3'].includes(text)) {
      await client.sendMessage(chatId, 'Пожалуйста, выберите цифру 1, 2 или 3', { sendSeen: false });
      return;
    }    
    sessions.data.child ??= {}
    let chooseLanguage: childLanguageType
    if('1' === text) chooseLanguage = 'russian'
    else if('2' === text) chooseLanguage = 'kazakh'
    else chooseLanguage = 'bilingual'
    sessions.data.child.language = chooseLanguage
    const askAge = 
    lang === 'русский'? askChildAgeRu:
    lang === 'қазақша'? askChildAgeKz:
    askChildAgeEn
    await client.sendMessage(chatId, askAge, {sendSeen: false})
    sessions.step = Steps.childInfo.waitAge
    console.log(sessions.step)
    return
  }

  
  if(sessions.step === Steps.childInfo.waitAge){
    sessions.data.child ??={}
    if(!['1', '2', '3', '4', '5', '6', '7'].includes(text)){
      await client.sendMessage(chatId, 'Пожалуйста, выберите цифру от 1 до 7', { sendSeen: false });
      return
    }

    const age = ageMap[text as keyof typeof ageMap]
    
    let lang: 'ru' | 'kz' | 'en' = 'ru'
    if (sessions.meta?.language === 'қазақша') lang = 'kz'
    if (sessions.meta?.language === 'english') lang = 'en'
    sessions.data.child.age = age[lang]
    sessions.step = Steps.test.testInit
  }
  
  if(sessions.step === Steps.test.testInit){
    const ageStr = sessions.data.child?.age!
    const ageNum = parseInt(ageStr)
    const testForChild = getTestByAge(ageNum)
    console.log(testForChild)

    let lang: 'ru' | 'kz' | 'en' = 'ru'
    if (sessions.meta?.language === 'қазақша') lang = 'kz'
    if (sessions.meta?.language === 'english') lang = 'en'

    const firstQuestion = testForChild.test[0].question[lang]
    await client.sendMessage(chatId, firstQuestion, {sendSeen: false})
    sessions.step = Steps.test.testAnswerSave
    console.log(
      'Вот данные:\n' +
      JSON.stringify(sessions, null, 2)
    );
  }

  if(sessions.step === Steps.test.testAnswerSave){
    
  }



  if(sessions.step === Steps.results.show){
    console.log(
      'Вот данные:\n' +
      JSON.stringify(sessions, null, 2)
    );
    
    delete session[chatId];
    return
  }
  
});

client.initialize();