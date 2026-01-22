export type language=
| 'русский'
| 'қазақша'
| 'english'

export type childLanguageType = 'kazakh' | 'russian' | 'bilingual'
// export type childAgeType = '1 лет' | '2 лет' | '3 лет' | '4 лет' | '5 лет' | '6 лет' | '7 лет'
export type childAgeText = '2' | '3' | '4' | '5' | '6' | '7'
export type childAgeType = {
  ru: '2 лет' | '3 лет' | '4 лет' | '5 лет' | '6 лет' | '7 лет',
  kz: '2 жас' | '3 жас' | '4 жас' | '5 жас' | '6 жас' | '7 жас',
  en: '2 age' | '3 age' | '4 age' | '5 age' | '6 age' | '7 age',
}

export const ageMap: Record<'2' | '3' | '4' | '5' | '6' | '7', childAgeType> = {
  '2': { ru: '2 лет', kz: '2 жас', en: '2 age' },
  '3': { ru: '3 лет', kz: '3 жас', en: '3 age' },
  '4': { ru: '4 лет', kz: '4 жас', en: '4 age' },
  '5': { ru: '5 лет', kz: '5 жас', en: '5 age' },
  '6': { ru: '6 лет', kz: '6 жас', en: '6 age' },
  '7': { ru: '7 лет', kz: '7 жас', en: '7 age' },
}



export type pointTest = 0 | 1 | 2

export interface SessionMeta{
  language?: language;
} 

export interface TestType{
  test:{
    question: {
      ru: string
      kz: string
      en: string 
    }
    answer: {
      text: {
        ru: string
        kz: string
        en: string
      }
      point: pointTest
    }[]
  }[]
}

interface SessionData {
  parent?: {
    fullname?: string;
    phone?: string;
  };
  child?: {
    language?: childLanguageType;
    fullname?: string;
    age?: string;
  };
}

export const Steps = {
  start: 'start' as const,
  language: {
    choose: 'chooseLanguage' as const,
    waitStart: 'waitStartLanguage' as const
  },
  parentInfo: {
    waitFullName: 'waitParentFullName' as const, 
    waitPhone: 'waitParentPhone' as const,
  },
  childInfo: {
    waitLanguage: 'waitChildLanguage' as const,
    waitFullName: 'waitChildFullName' as const,
    waitAge: 'waitChildAge' as const
  },
  test:{
    testInit: 'testInit' as const,
    testAnswerSave: 'testAnswerSave' as const,
    testResult: 'testResult' as const
  },
  results: {
    show: 'showResults' as const,
    finished: 'finished' as const,
  },
};

export type Step = 
  typeof Steps.start |
  typeof Steps.language[keyof typeof Steps.language] | 
  typeof Steps.parentInfo[keyof typeof Steps.parentInfo] |
  typeof Steps.childInfo[keyof typeof Steps.childInfo] |
  typeof Steps.test[keyof typeof Steps.test] |
  typeof Steps.results[keyof typeof Steps.results];

export interface SessionType {
  step: Step;
  data?: SessionData;
  meta?: SessionMeta
}
