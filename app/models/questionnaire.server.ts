import type { User, Questionnaire } from "@prisma/client";
import cuid, { isCuid } from "cuid";

import { prisma } from "~/db.server";

export function getQuestionnaire({
  code,
  userId,
}: Pick<Questionnaire, "code"> & {
  userId?: User["id"];
}) {
  let _code, id;
  isCuid(code) ? (id = code) : (_code = code);
  
  return prisma.questionnaire.findFirst({
    where: { id, code: _code, authorId: userId },
    include: { questions: true, respondents: true },
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
  theme,
  expiresAt,
  userId,
}: Pick<Questionnaire, "name" | "description" | "expiresAt" | "theme"> & {
  userId: User["id"];
}) {
  return prisma.questionnaire.create({
    data: {
      name,
      description,
      expiresAt,
      code: cuid.slug(),
      theme,
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
