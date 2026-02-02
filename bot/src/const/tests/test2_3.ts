import { TestType } from "../../interface/interface.sessions";

export const test2_3: TestType = {
  test: [
    {
      question: {
        ru: "Ребёнок реагирует, когда его зовут или с ним разговаривают?",
        kz: "Бала аты аталғанда немесе сөйлегенде назар аудара ма?",
        en: "Does the child pay attention when their name is called or when spoken to?"
      },
      answer: [
        {
          text: { ru: "Да", kz: "Иә", en: "Yes" },
          point: 2
        },
        {
          text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" },
          point: 1
        },
        {
          text: { ru: "Нет", kz: "Жоқ", en: "No" },
          point: 0
        }
      ]
    },

    {
      question: {
        ru: "Понимает ли ребёнок простые задания? (\"Принеси мяч\", \"Сядь\", \"Дай\")",
        kz: "Қарапайым тапсырмаларды түсіне ме? (\"Допты әкел\", \"Отыр\", \"Бер\")",
        en: "Does the child understand simple commands? (\"Bring the ball\", \"Sit\", \"Give\")"
      },
      answer: [
        {
          text: { ru: "Да", kz: "Иә", en: "Yes" },
          point: 2
        },
        {
          text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" },
          point: 1
        },
        {
          text: { ru: "Нет", kz: "Жоқ", en: "No" },
          point: 0
        }
      ]
    },

    {
      question: {
        ru: "Есть ли у ребёнка слова, которые он использует ежедневно? (мама, вода, дай, нет)",
        kz: "Бала күнделікті қолданатын сөздері бар ма? (мама, су, бер, жоқ)",
        en: "Does the child have everyday words they use? (mom, water, give, no)"
      },
      answer: [
        {
          text: { ru: "Много", kz: "Көп", en: "Many" },
          point: 2
        },
        {
          text: { ru: "Мало", kz: "Аз", en: "Few" },
          point: 1
        },
        {
          text: { ru: "Нет", kz: "Жоқ", en: "None" },
          point: 0
        }
      ]
    },

    {
      question: {
        ru: "Произносит ли ребёнок фразы из двух слов? (\"мама дай\", \"дай мяч\")",
        kz: "Екі сөзден тұратын тіркестер айта ма? (\"мама бер\", \"доп бер\")",
        en: "Does the child say two-word phrases? (\"mom give\", \"give ball\")"
      },
      answer: [
        {
          text: { ru: "Да", kz: "Иә", en: "Yes" },
          point: 2
        },
        {
          text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" },
          point: 1
        },
        {
          text: { ru: "Нет", kz: "Жоқ", en: "No" },
          point: 0
        }
      ]
    },

    {
      question: {
        ru: "Пытается ли ребёнок повторять слова взрослых?",
        kz: "Үлкендердің айтқан сөзін қайталауға тырыса ма?",
        en: "Does the child try to repeat words said by adults?"
      },
      answer: [
        {
          text: { ru: "Да", kz: "Иә", en: "Yes" },
          point: 2
        },
        {
          text: { ru: "Иногда", kz: "Кейде", en: "Sometimes" },
          point: 1
        },
        {
          text: { ru: "Нет", kz: "Жоқ", en: "No" },
          point: 0
        }
      ]
    }
  ]
}