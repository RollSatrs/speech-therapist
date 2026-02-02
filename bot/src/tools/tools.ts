import { test2_3 } from "../const/tests/test2_3"
import { test3_4 } from "../const/tests/test3_4"
import { test4_5 } from "../const/tests/test4_5"
import { test5_7 } from "../const/tests/test5_7"
import { language } from "../interface/interface.sessions"

export function getTestByAge(ageNumber: number){
    if(ageNumber >= 2 && ageNumber <= 3) return test2_3
    if(ageNumber >= 3 && ageNumber <= 4) return test3_4
    if(ageNumber >= 4 && ageNumber <= 5) return test4_5
    if(ageNumber >= 5 && ageNumber <= 7) return test5_7
    return test2_3
}

export function getActiveLanguageSystem(lanInput: language){
    let lang: 'ru' | 'kz' | 'en' = 'ru'
    if(lanInput === 'қазақша') lang = "kz"
    return lang
}

export function normalizePhone(input: string): string {
  return input.replace(/\D/g, "");
}

export function isValidPhone(phone: string): boolean{
  return phone.startsWith("8") && phone.length === 11;
}

export function isValidDate(input: string): boolean{
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(input)) return false;

  const [dd, mm, yyyy] = input.split('.').map(Number);
  if (mm < 1 || mm > 12) return false;

  const daysInMonth = new Date(yyyy, mm, 0).getDate();
  if (dd < 1 || dd > daysInMonth) return false;

  return true;
};
