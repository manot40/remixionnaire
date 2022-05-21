import type { Questionnaire } from "@prisma/client";
import { prisma } from "~/db.server";

export function getAnswers({
  questionnaireId,
}: {
  questionnaireId: Questionnaire["id"];
}) {
  return prisma.answer.findMany({
    where: { questionnaireId },
    orderBy: { answeredAt: "desc" },
  });
}
