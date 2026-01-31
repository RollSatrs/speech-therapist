import { StepsUpdate } from "../const/sesion";
import { StepHandler } from "../types/stepContext";
import { handlerchildAge } from "./child/chilAge";
import { handlerChildFullName } from "./child/childFullName";
import { handlerChildLanguage } from "./child/childLanguage";
import { handlerChooseUiLanguage } from "./chooseUiLanguage";
import { handlerIdle } from "./idle";
import { handlerMainMenu } from "./mainMenu";
import { handlerParentFullName } from "./parent/parentFullName";
import { handlerParentPhone } from "./parent/parentPhone";

export const stepHandlers: Record<
  typeof StepsUpdate[keyof typeof StepsUpdate],
  StepHandler
> = {
    [StepsUpdate.idle]: handlerIdle,
    [StepsUpdate.chooseUiLanguage]: handlerChooseUiLanguage,
    [StepsUpdate.mainMenu]: handlerMainMenu,
    [StepsUpdate.parentPhone]: handlerParentPhone,
    [StepsUpdate.parentFullName]: handlerParentFullName,
    [StepsUpdate.childFullName]: handlerChildFullName,
    [StepsUpdate.childLanguage]: handlerChildLanguage,
    [StepsUpdate.childAge]: handlerchildAge,
}