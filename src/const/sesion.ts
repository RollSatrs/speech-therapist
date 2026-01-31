import { childAgeType, SessionType,  } from "../interface/interface.sessions";

export const session: Record<string, SessionType>={}

export const StepsUpdate = {
  idle: 'idle',
  chooseUiLanguage: "chooseUiLanguage",
  mainMenu: "mainMenu",
  parentPhone: "parentPhone",
  parentFullName: "parentFullName",
  childFullName: "childFullName",
  childLanguage: "childLanguage",
  childAge: "childAge"
  
} as const

export const ageMap: Record<'2' | '3' | '4' | '5' | '6' | '7', childAgeType> = {
  '2': { ru: '2 года', kz: '2 жас', en: '2 age' },
  '3': { ru: '3 года', kz: '3 жас', en: '3 age' },
  '4': { ru: '4 года', kz: '4 жас', en: '4 age' },
  '5': { ru: '5 лет', kz: '5 жас', en: '5 age' },
  '6': { ru: '6 лет', kz: '6 жас', en: '6 age' },
  '7': { ru: '7 лет', kz: '7 жас', en: '7 age' },
}