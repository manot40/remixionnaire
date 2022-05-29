import type {
  Question as PQuestion,
  Questionnaire,
  Respondent,
  Answer,
} from "@prisma/client";

type GenericObj<T = any> = { [key: string]: T };

type ChangeType<T extends object, Keys extends keyof T, NewType> = {
  [key in keyof T]: key extends Keys ? NewType : T[key];
};

interface Question extends ChangeType<PQuestion, "list", string[]> {
  answers: Answer[];
  modified?: boolean;
}

type QuestionnaireData = {
  meta: Questionnaire;
  respondents: Respondent[];
  questions: Question[];
};
