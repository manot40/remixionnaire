import type { ChangeType } from "~/types";
import type { Question as PQuestion } from "@prisma/client";

import { prisma } from "~/db.server";

type Question = ChangeType<PQuestion, "list", any[]>;

export function createQuestions(questions: Omit<Question, "id">[]) {
  return prisma.question.createMany({ data: questions });
}

export function updateQuestion(question: Omit<Question, "updatedAt">) {
  return prisma.question.update({
    where: { id: question.id },
    data: { ...question },
  });
}

export function deleteQuestions(ids: string[]) {
  return prisma.question.deleteMany({
    where: { id: { in: ids } },
  });
}
