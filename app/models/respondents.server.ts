import type { Respondent } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getRespondents(email?: Respondent["email"]) {
  return prisma.respondent.findMany({ where: { email } });
}

export async function getRespondentByMail(email: Respondent["email"]) {
  return prisma.respondent.findFirst({ where: { email } });
}

export async function createRespondent(
  respondent: Omit<Respondent, "createdAt" | "id">
) {
  return prisma.respondent.upsert({
    where: { email: respondent.email },
    update: respondent,
    create: respondent,
  });
}
