import { StepsUpdate } from "../const/sesion";
import { StepHandler } from "../types/stepContext";
import { handlerChildPickOrCreate } from "./childPickOrCreate";
import { handlerChooseUiLanguage } from "./chooseUiLanguage";
import { handlerIdle } from "./idle";
import { handlerMainMenu } from "./mainMenu";
import { handlerParentFullName } from "./parentFullName";
import { handlerParentPhone } from "./parentPhone";

export const stepHandlers: Record<
  typeof StepsUpdate[keyof typeof StepsUpdate],
  StepHandler
> = {
    [StepsUpdate.idle]: handlerIdle,
    [StepsUpdate.chooseUiLanguage]: handlerChooseUiLanguage,
    [StepsUpdate.parentPhone]: handlerParentPhone,
    [StepsUpdate.childPickOrCreate]: handlerChildPickOrCreate,
    [StepsUpdate.mainMenu]: handlerMainMenu,
    [StepsUpdate.parentFullName]: handlerParentFullName
}