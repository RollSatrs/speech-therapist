import { TestType } from "../../interface/interface.sessions";

export const test3_4: TestType = {
  test: [
    {
      question: {
        ru: "Говорит ли ребёнок предложениями из 2–3 слов?",
        kz: "Бала 2–3 сөзден тұратын сөйлеммен сөйлей ме?",
        en: "Does the child speak using 2–3 word sentences?"
      },
      answer: [
        { text: { ru: "Да", kz: "Иә", en: "Yes" }, point: 2 },
        { text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" }, point: 1 },
        { text: { ru: "Нет", kz: "Жоқ", en: "No" }, point: 0 }
      ]
    },

    {
      question: {
        ru: "Понимает ли ребёнок вопросы «Что?» и «Где?»?",
        kz: "«Не?», «Қайда?» деген сұрақтарды түсіне ме?",
        en: "Does the child understand the questions “What?” and “Where?”?"
      },
      answer: [
        { text: { ru: "Да", kz: "Иә", en: "Yes" }, point: 2 },
        { text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" }, point: 1 },
        { text: { ru: "Нет", kz: "Жоқ", en: "No" }, point: 0 }
      ]
    },

    {
      question: {
        ru: "Может ли ребёнок самостоятельно называть предметы?",
        kz: "Заттардың атын өз бетінше атай ала ма?",
        en: "Can the child independently name objects?"
      },
      answer: [
        { text: { ru: "Да", kz: "Иә", en: "Yes" }, point: 2 },
        { text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" }, point: 1 },
        { text: { ru: "Нет", kz: "Жоқ", en: "No" }, point: 0 }
      ]
    },

    {
      question: {
        ru: "Описывает ли ребёнок действия словами? (бежит, пьёт, играет)",
        kz: "Іс-әрекеттерді сөзбен айта ма? (жүгір, іш, ойна)",
        en: "Does the child name actions using words? (run, drink, play)"
      },
      answer: [
        { text: { ru: "Да", kz: "Иә", en: "Yes" }, point: 2 },
        { text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" }, point: 1 },
        { text: { ru: "Нет", kz: "Жоқ", en: "No" }, point: 0 }
      ]
    },

    {
      question: {
        ru: "Как ребёнок чаще всего говорит?",
        kz: "Сөйлегенде көбіне:",
        en: "How does the child usually speak?"
      },
      answer: [
        {
          text: {
            ru: "Предложениями",
            kz: "Сөйлеммен",
            en: "In sentences"
          },
          point: 2
        },
        {
          text: {
            ru: "Короткими словами",
            kz: "Қысқа сөздермен",
            en: "With short words"
          },
          point: 1
        },
        {
          text: {
            ru: "Отдельными звуками",
            kz: "Жеке дыбыстармен",
            en: "With separate sounds"
          },
          point: 0
        }
      ]
    }
  ]
}