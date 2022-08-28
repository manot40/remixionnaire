import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import cuid from "cuid";

const prisma = new PrismaClient();

async function seed() {
  const email = "john@doe.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("superstronkpassword", 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: "John Doe",
      password: hashedPassword,
    },
  });

  await prisma.questionnaire.deleteMany({});
  const questionnaire = await prisma.questionnaire.create({
    data: {
      name: "My first form",
      description: faker.lorem.sentences(3),
      authorId: user.id,
      code: cuid.slug(),
      theme: "82d9d9",
      questions: {
        create: [
          {
            order: 0,
            name: "How are you doing?",
            type: "SHORT_TEXT",
          },
          {
            order: 1,
            name: "What is your gender?",
            type: "RADIO",
            list: ["Male", "Female"],
          },
          {
            order: 2,
            name: "Describe yourself",
            type: "TEXT",
          },
        ],
      },
    },
    include: { questions: true },
  });

  await prisma.respondent.deleteMany({});
  const tmpResp: any[] = [];
  for (let i = 0; i < 10; i++) {
    tmpResp.push({
      name: faker.name.findName(),
      email: faker.internet.email(),
    });
  }
  await prisma.respondent.createMany({ data: tmpResp });

  await prisma.respondent.findMany({}).then(async (respondents) => {
    const answers: any[] = [];
    respondents.forEach((respondent) => {
      questionnaire.questions.forEach((question) => {
        answers.push({
          questionnaireId: questionnaire.id,
          respondentId: respondent.id,
          questionId: question.id,
          answer:
            question.type === "RADIO"
              ? faker.helpers.arrayElement(["Female", "Male"])
              : faker.lorem.sentence(),
        });
      });
    });
    await prisma.answer.createMany({ data: answers });
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
