export type Step =
  | 'chooseLanguage'
  | 'askParentName'
  | 'askChildAge'
  | 'askQuestion1'
  | 'askQuestion2'
  | 'showResults'
  | 'finished';

export interface Session {
  step: Step;
  data?: any;
}
