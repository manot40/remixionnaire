import type { Question as ToBeOmitted } from "~/types";

import { atom } from "recoil";

type Question = Omit<ToBeOmitted, "answers">;

export const questionsStore = atom({
  key: "questionsStore",
  default: [] as Question[],
});
