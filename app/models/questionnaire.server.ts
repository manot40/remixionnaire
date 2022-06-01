import type { User, Questionnaire } from "@prisma/client";
import cuid, { isCuid } from "cuid";

import { prisma } from "~/db.server";

type Relation = "questions" | "respondents" | "answers";
type QreKey<T = unknown> = { [key in Relation]?: T };

interface IQre {
  code: Questionnaire["code" | "id"];
  status?: Questionnaire["status"];
  include?: QreKey<boolean>;
  userId?: User["id"];
}

export function getQuestionnaire({
  code,
  userId,
  include,
  status,
}: IQre): Promise<(Questionnaire & QreKey) | null> {
  let _code, id;
  isCuid(code) ? (id = code) : (_code = code);

  return prisma.questionnaire.findFirst({
    where: {
      id,
      code: _code,
      authorId: userId,
      status,
    },
    include,
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

export function updateQuestionnaire(id: string, qre: Partial<Questionnaire>) {
  return prisma.questionnaire.update({
    where: { id },
    data: qre,
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
