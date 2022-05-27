import type { QuestionnaireData } from "~/types";

import { atom } from "recoil";

export const questionsStore = atom({
  key: "questionsStore",
  default: [] as QuestionnaireData["questions"],
});