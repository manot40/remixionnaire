import type { Answer, Questionnaire } from "@prisma/client";
import { prisma } from "~/db.server";

export function getAnswers({
  questionnaireId,
}: {
  questionnaireId: Questionnaire["id"];
}) {
  return prisma.answer.findMany({
    where: { questionnaireId },
    orderBy: { answeredAt: "desc" },
    include: {
      respondent: true,
    },
  });
}

export function createAnswers(answers: Omit<Answer, "id" | "answeredAt">[]) {
  return prisma.answer.createMany({
    data: answers,
  });
}

export function checkIfAnswered(
  respondentId: Answer["respondentId"],
  questionnaireId: Answer["questionnaireId"]
) {
  return prisma.answer.count({
    where: {
      respondentId,
      questionnaireId,
    },
  });
}
