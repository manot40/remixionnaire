import type { Questionnaire, Respondent, Question, Answer } from "@prisma/client";

type GenericObj<T = any> = { [key: string]: T };

interface Questions extends Question {
  answers: Answer[];
}

type QuestionnaireData = {
  meta: Questionnaire;
  respondents: Respondent[];
  questions: Questions[];
};