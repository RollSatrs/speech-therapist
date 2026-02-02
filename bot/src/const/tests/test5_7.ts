import { TestType } from "../../interface/interface.sessions";

export const test5_7: TestType = {
  test: [
    {
      question: {
        ru: "Может ли ребёнок составить полный рассказ по картинке?",
        kz: "Бала сурет бойынша толық әңгіме құрастыра ала ма?",
        en: "Can the child create a complete story based on a picture?"
      },
      answer: [
        { text: { ru: "Да", kz: "Иә", en: "Yes" }, point: 2 },
        { text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" }, point: 1 },
        { text: { ru: "Нет", kz: "Жоқ", en: "No" }, point: 0 }
      ]
    },

    {
      question: {
        ru: "Присутствуют ли в рассказе начало, середина и конец?",
        kz: "Әңгімесінде басы, ортасы, соңы байқала ма?",
        en: "Does the story have a beginning, middle, and end?"
      },
      answer: [
        { text: { ru: "Да", kz: "Иә", en: "Yes" }, point: 2 },
        { text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" }, point: 1 },
        { text: { ru: "Нет", kz: "Жоқ", en: "No" }, point: 0 }
      ]
    },

    {
      question: {
        ru: "Может ли ребёнок назвать первый звук в слове?",
        kz: "Сөздердің бірінші дыбысын атай ала ма?",
        en: "Can the child name the first sound of a word?"
      },
      answer: [
        { text: { ru: "Да", kz: "Иә", en: "Yes" }, point: 2 },
        { text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" }, point: 1 },
        { text: { ru: "Нет", kz: "Жоқ", en: "No" }, point: 0 }
      ]
    },

    {
      question: {
        ru: "Слышит ли ребёнок различия между похожими словами?",
        kz: "Ұқсас сөздердің айырмашылығын ести ме?",
        en: "Can the child hear differences between similar words?"
      },
      answer: [
        { text: { ru: "Да", kz: "Иә", en: "Yes" }, point: 2 },
        { text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" }, point: 1 },
        { text: { ru: "Нет", kz: "Жоқ", en: "No" }, point: 0 }
      ]
    },

    {
      question: {
        ru: "Проявляет ли ребёнок интерес к буквам или письму?",
        kz: "Әріптерге немесе жазуға қызығушылық таныта ма?",
        en: "Does the child show interest in letters or writing?"
      },
      answer: [
        { text: { ru: "Да", kz: "Иә", en: "Yes" }, point: 2 },
        { text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" }, point: 1 },
        { text: { ru: "Нет", kz: "Жоқ", en: "No" }, point: 0 }
      ]
    }
  ]
}