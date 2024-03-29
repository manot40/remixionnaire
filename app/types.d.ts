import type {
  Question as PQuestion,
  Questionnaire,
  Respondent,
  Answer,
} from "@prisma/client";

type GenericObj<T = unknown, K = object> = {
  [key in keyof K]: T;
};

type ChangeType<T extends object, Keys extends keyof T, NewType> = {
  [key in keyof T]: key extends Keys ? NewType : T[key];
};

interface Question extends ChangeType<PQuestion, "list", string[]> {
  answers?: Answer[];
  modified?: boolean;
}

interface PublicForm extends ChangeType<PQuestion, "list", string[]> {
  answer: string;
  questionnaireId: string;
  respondentId?: string;
}

type WorkspaceData = {
  meta: Questionnaire;
  respondents: Respondent[];
  questions: Question[];
};
