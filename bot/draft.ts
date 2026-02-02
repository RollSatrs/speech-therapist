//   if (!session[chatId]) {
//     console.log('sesion')
//     session[chatId] = {
//       step: 'start',
//       meta: {},
//       data: {}
//     };
//   }
//   const sessions = session[chatId]
//   sessions.meta = sessions.meta ?? {}
//   const lang = sessions.meta?.language
//   if(sessions.step === Steps.start){
//     if(text === 'старт'){
//       await client.sendMessage(chatId, languageText, {sendSeen: false})
//       sessions.step = Steps.language.choose
//       return
//     }
//   }

//   sessions.data ??= {}
  
//   if(sessions.step == Steps.language.choose){
//     if (!['русский', 'қазақша', 'english'].includes(text)) return;
//     sessions.meta ??= {}
//     sessions.meta.language = text as any
//     const welcome = 
//       text === 'русский'? welcomeRu:
//       text === 'қазақша'? welcomeKz:
//       welcomeEn

//     await client.sendMessage(chatId, welcome, {sendSeen: false})
//     sessions.step = Steps.language.waitStart
//     console.log('Welcomdd',text)
//   }

//   if(sessions.step === Steps.language.waitStart){
//     if (!['начать тест', 'тесті бастау', 'start test'].includes(text)) return;

//     const askParentName =
//       lang === 'русский'? askParentNameRu:
//       lang === 'қазақша'? askParentNameKz:
//       askParentPhoneEn
  
//     await client.sendMessage(chatId, askParentName, {sendSeen: false})

//     sessions.step = Steps.parentInfo.waitFullName
//     return
//   }

//   if(sessions.step == Steps.parentInfo.waitFullName){
//     sessions.data.parent ??= {}
//     sessions.data.parent.fullname = rawText

//     const askParentPhone = 
//       lang === 'русский'? askParentPhoneRu:
//       lang === 'қазақша'? askParentPhoneKz:
//       askParentPhoneEn
    

//     await client.sendMessage(chatId, askParentPhone, {sendSeen: false})
//     sessions.step = Steps.parentInfo.waitPhone
//     return
//   }

//   if(sessions.step === Steps.parentInfo.waitPhone){
//     sessions.data.parent ??= {}
//     sessions.data.parent.phone = text
//     const askChildFullName =
//       lang === 'русский'? askChildFullNameRu:
//       lang === 'қазақша'? askChildFullNameKz:
//       askChildFullNameEn

//       await client.sendMessage(chatId, askChildFullName, {sendSeen: false})
//       sessions.step = Steps.childInfo.waitFullName
//       return
//     }

//   if(sessions.step === Steps.childInfo.waitFullName){
//     sessions.data.child ??= {}
//     sessions.data.child.fullname = rawText

//     const askChildLanguage =
//       lang === 'русский'? askChildLanguageRu:
//       lang === 'қазақша'? askChildLanguageKz:
//       askChildLanguageEn
//     await client.sendMessage(chatId, askChildLanguage, {sendSeen: false})
//     sessions.step = Steps.childInfo.waitLanguage
//     return
//   }
  

//   if(sessions.step === Steps.childInfo.waitLanguage){
//     if (!['1', '2', '3'].includes(text)) {
//       await client.sendMessage(chatId, 'Пожалуйста, выберите цифру 1, 2 или 3', { sendSeen: false });
//       return;
//     }    
//     sessions.data.child ??= {}
//     let chooseLanguage: childLanguageType
//     if('1' === text) chooseLanguage = 'russian'
//     else if('2' === text) chooseLanguage = 'kazakh'
//     else chooseLanguage = 'bilingual'
//     sessions.data.child.language = chooseLanguage
//     const askAge = 
//     lang === 'русский'? askChildAgeRu:
//     lang === 'қазақша'? askChildAgeKz:
//     askChildAgeEn
//     await client.sendMessage(chatId, askAge, {sendSeen: false})
//     sessions.step = Steps.childInfo.waitAge
//     console.log(sessions.step)
//     return
//   }

  
//   if(sessions.step === Steps.childInfo.waitAge){
//     sessions.data.child ??={}
//     if(!['1', '2', '3', '4', '5', '6', '7'].includes(text)){
//       await client.sendMessage(chatId, 'Пожалуйста, выберите цифру от 1 до 7', { sendSeen: false });
//       return
//     }

//     const age = ageMap[text as keyof typeof ageMap]
    
//     let lang: 'ru' | 'kz' = 'ru'
//     if (sessions.meta?.language === 'қазақша') lang = 'kz'
//     sessions.data.child.age = age[lang]
//     sessions.step = Steps.test.testInit
//   }
  
//   if (sessions.step === Steps.test.testInit) {
//     const ageStr = sessions.data.child?.age!;
//     const ageNum = parseInt(ageStr);
//     const testForChild = getTestByAge(ageNum);
// 2 
//     let lang: 'ru' | 'kz' = 'ru';
//     if (sessions.meta?.language === 'қазақша') lang = 'kz';

//     const firstQuestion = testForChild.test[0].question[lang];

//     // Красивое форматирование с номерами вариантов
//     const answerText = testForChild.test[0].answer
//       .map((a, idx) => `${idx + 1}. ${a.text[lang]}`)
//       .join('\n');

//     const test_text = `❓ *Вопрос:*\n${firstQuestion}\n\n📝 *Варианты ответов:*\n${answerText}`;

//     await client.sendMessage(chatId, test_text, { sendSeen: false });
//     console.log(
//       'Вот данные:\n' +
//       JSON.stringify(sessions, null, 2)
//     );
//     sessions.step = Steps.test.testAnswerSave;
//     sessions.meta.questionIndex = 0;
//     return;
//   }

//   if(sessions.step === Steps.test.testAnswerSave){
//     const ageStr = sessions.data.child?.age!
//     const ageNum = parseInt(ageStr)
//     const questionIndex = sessions.meta.questionIndex

//   }


//   if(sessions.step === Steps.results.show){
    
//     delete session[chatId];
//     return
//   }




// export const Steps = {
//   start: 'start' as const,
//   language: {
//     choose: 'chooseLanguage' as const,
//     waitStart: 'waitStartLanguage' as const
//   },
//   parentInfo: {
//     waitFullName: 'waitParentFullName' as const, 
//     waitPhone: 'waitParentPhone' as const,
//   },
//   childInfo: {
//     waitLanguage: 'waitChildLanguage' as const,
//     waitFullName: 'waitChildFullName' as const,
//     waitAge: 'waitChildAge' as const
//   },
//   test:{
//     testInit: 'testInit' as const,
//     testAnswerSave: 'testAnswerSave' as const,
//     testResult: 'testResult' as const
//   },
//   results: {
//     show: 'showResults' as const,
//     finished: 'finished' as const,
//   },
// };


// export const welcomeRu = `*Здравствуйте!* 👋  
// Вы находитесь в сервисе *скрининговой оценки речевого развития ребёнка*.
// ⏱ *Время прохождения:* несколько минут  
// ❗ _Результаты носят рекомендательный характер_ и *не являются медицинским диагнозом*.
// 👉 *Чтобы начать, напишите:*  
// *начать тест*`;

// export const welcomeKz = `*Сәлеметсіз бе!* 👋  
// Сіз *2–7 жас аралығындағы баланың сөйлеу дамуын скринингтік бағалау* сервисінде отырсыз.
// ⏱ *Тесті өту уақыты:* бірнеше минут  
// ❗ _Нәтижелер ақпараттық сипатта және медициналық диагноз емес_.
// 👉 *Бастау үшін жазыңыз:*  
// *тесті бастау*`;








//   if(s.step === StepsUpdate.idle){
//     if(['страт', 'бастау'].includes(text)){
//       await client.sendMessage(chatId, languageText, { sendSeen: false })
//       s.step = StepsUpdate.chooseUiLanguage
//     }
//     return
//   }

//   if(s.step === StepsUpdate.chooseUiLanguage){
//     if(!['1', '2'].includes(text)){
//       await client.sendMessage(chatId, errLanguageText, { sendSeen: false })
//       return
//     }
//       const saveLang = text === "1" ? "русский" : 'қазақша'
//       s.meta.language = saveLang
//       s.step = StepsUpdate.parentPhone
//   }

//   if(s.step === StepsUpdate.parentPhone){
//     const phone = normalizePhone(rawText)
//     if(!isValidPhone(phone)){
//       const errText = langData === "қазақша" ? invalidPhoneKz : invalidPhoneRu
//       await client.sendMessage(chatId, errText, { sendSeen: false })
//       return
//     }
//     const foundParent = await db.select().from(parentsTable).where(eq(parentsTable.phone, phone)).limit(1)
//     if(foundParent.length){
//       const parentData = foundParent[0]
//       const {id, fullname, phone} = parentData
//       const parentId = id
//       const parentFullName = fullname
//       const parentPhone = phone
//       s.meta.parentId = parentId
//       const foundChild = await db.select().from(childrenTable).where(eq(childrenTable.parentId, parentId))
//       if(foundChild.length){
//         const childrenData = foundChild[0]
//         const {id, fullname, language, birthDate} = childrenData
//         const childId = id
//         const childFullName = fullname
//         const childLanguage = language
//         const childBithDate = birthDate
//         s.meta.child = childId
//         const profileData = {
//           parent: {
//             fullName: parentFullName,
//             phone: parentPhone,
//           },
//           child: {
//             fullName: childFullName,
//             birthDate: childBithDate,
//             language: childLanguage,
//           },
//         };
//         const menuText = langData === 'қазақша' ? menuKz(profileData) : menuRu(profileData) 
//         await client.sendMessage(chatId, menuText, { sendSeen: false })
//         s.step = StepsUpdate.mainMenu
//       }else{
//         const noChildText = langData === 'қазақша' ? noChildProfileKz(parentFullName, parentPhone) : noChildProfileRu(parentFullName, parentPhone) 
//         await client.sendMessage(chatId, noChildText, { sendSeen: false })
//         s.step = StepsUpdate.childPickOrCreate
//       }


//     }else{
//       'скоро начну делать'
//     }
//   }