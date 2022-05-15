import type { User, Questionnaire } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Questionnaire };

export function getQuestionnaire({
  id,
  userId,
}: Pick<Questionnaire, "id"> & {
  userId: User["id"];
}) {
  return prisma.questionnaire.findFirst({
    where: { id, authorId: userId },
  });
}

export function getQuestionnaires({ userId }: { userId: User["id"] }) {
  return prisma.questionnaire.findMany({
    where: { authorId: userId },
    orderBy: { updatedAt: "desc" },
  });
}

export function createQuestionnaire({
  name,
  description,
  expiresAt,
  userId,
}: Pick<Questionnaire, "name" | "description" | "expiresAt"> & {
  userId: User["id"];
}) {
  return prisma.questionnaire.create({
    data: {
      name,
      description,
      expiresAt,
      author: {
        connect: { id: userId },
      },
    },
  });
}

export function deleteQuestionnaire({
  id,
  userId,
}: Pick<Questionnaire, "id"> & { userId: User["id"] }) {
  return prisma.questionnaire.deleteMany({
    where: { id, authorId: userId },
  });
}
