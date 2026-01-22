import { TestType } from "../../interface/interface.sessions";

export const test4_5: TestType = {
  test: [
    {
      question: {
        ru: "Может ли ребёнок рассказать о своих мыслях или о произошедшем событии?",
        kz: "Бала өз ойын немесе болған оқиғаны айтып бере ала ма?",
        en: "Can the child tell about their thoughts or a past event?"
      },
      answer: [
        { text: { ru: "Да", kz: "Иә", en: "Yes" }, point: 2 },
        { text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" }, point: 1 },
        { text: { ru: "Нет", kz: "Жоқ", en: "No" }, point: 0 }
      ]
    },

    {
      question: {
        ru: "Использует ли ребёнок формы множественного числа? (дети, игрушки)",
        kz: "Көптік жалғауларды қолдана ма? (балалар, ойыншықтар)",
        en: "Does the child use plural forms? (children, toys)"
      },
      answer: [
        { text: { ru: "Да", kz: "Иә", en: "Yes" }, point: 2 },
        { text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" }, point: 1 },
        { text: { ru: "Нет", kz: "Жоқ", en: "No" }, point: 0 }
      ]
    },

    {
      question: {
        ru: "Правильно ли ребёнок использует слова «мой», «твой», «его/её»?",
        kz: "«Менің», «сенің», «оның» сөздерін дұрыс қолдана ма?",
        en: "Does the child correctly use the words “my”, “your”, “his/her”?"
      },
      answer: [
        { text: { ru: "Да", kz: "Иә", en: "Yes" }, point: 2 },
        { text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" }, point: 1 },
        { text: { ru: "Нет", kz: "Жоқ", en: "No" }, point: 0 }
      ]
    },

    {
      question: {
        ru: "Замечается ли искажение или пропуск звуков в словах?",
        kz: "Кейбір дыбыстарды бұрмалап айту немесе дыбыстарды қалдырып кету байқала ма?",
        en: "Is sound distortion or omission noticed in words?"
      },
      answer: [
        {
          text: { ru: "Нет", kz: "Жоқ", en: "No" },
          point: 2
        },
        {
          text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" },
          point: 1
        },
        {
          text: { ru: "Да", kz: "Иә", en: "Yes" },
          point: 0
        }
      ]
    },

    {
      question: {
        ru: "Может ли ребёнок различать похожие по звучанию слова? (бал–мал, лак–бак)",
        kz: "Ұқсас сөздердің дыбыстарын ажырата ала ма? (бал–мал), (лақ–бақ)",
        en: "Can the child distinguish similar-sounding words? (bal–mal, lak–bak)"
      },
      answer: [
        { text: { ru: "Да", kz: "Иә", en: "Yes" }, point: 2 },
        { text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" }, point: 1 },
        { text: { ru: "Нет", kz: "Жоқ", en: "No" }, point: 0 }
      ]
    }
  ]
}