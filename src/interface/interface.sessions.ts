import { StepsUpdate } from "../const/sesion"

export type language=
| 'русский'
| 'қазақша'

export type childLanguageType = 'kazakh' | 'russian' | 'bilingual'
// export type childAgeType = '1 лет' | '2 лет' | '3 лет' | '4 лет' | '5 лет' | '6 лет' | '7 лет'
export type childAgeText = '2' | '3' | '4' | '5' | '6' | '7'
export type childAgeType = {
  ru: '2 года' | '3 года' | '4 года' | '5 лет' | '6 лет' | '7 лет',
  kz: '2 жас' | '3 жас' | '4 жас' | '5 жас' | '6 жас' | '7 жас',
  en: '2 age' | '3 age' | '4 age' | '5 age' | '6 age' | '7 age',
}


export type pointTest = 0 | 1 | 2

export interface Meta{ 
  language?: language; 
  parentId?: number;
  child?: number;
  sessionId?: number
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
  testAnswers?: { questionText: string, answerText: string }[]
}

export type Step = typeof StepsUpdate[keyof typeof StepsUpdate]

export interface SessionType {
  step: Step;
  data: SessionData;
  meta: Meta
}