/* eslint-disable react-hooks/exhaustive-deps */
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { Questionnaire, Respondent } from "@prisma/client";
import type { WorkspaceData, Question } from "~/types";

// Remix Libs
import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

// React Libs
import { Container, Link, Spacer, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import dayjs from "dayjs";
import clsx from "clsx";

// Custom libs and helper
import {
  createQuestions,
  deleteQuestions,
  updateQuestion,
} from "~/models/question.server";
import { objArrSort } from "~/libs";
import { questionsStore } from "~/store";
import { getUserId } from "~/session.server";
import { getAnswers } from "~/models/answer.server";
import {
  getQuestionnaire,
  updateQuestionnaire,
} from "~/models/questionnaire.server";

// UI Components
import AnswersTable from "~/components/AnswersTable";
import QuestionsEditor from "~/components/QuestionsEditor";
import QuestionSetting from "~/components/QuestionSetting";

type SubmitData = {
  modified: Omit<Question, "answers">[];
  newEntry: Omit<Question, "answers">[];
  removed: string[];
};

type ActionData = {
  success?: boolean;
  error?: string;
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const { formId } = params;

  switch (request.method) {
    case "POST": {
      const data: SubmitData = JSON.parse(formData.get("data") as string);
      if (data.newEntry.length) {
        const { count } = await createQuestions(data.newEntry);
        if (count < 1)
          return json<ActionData>({ error: "Failed to create questions" });
      }
      if (data.modified.length) {
        for (const question of data.modified) {
          try {
            await updateQuestion(question);
          } catch {
            return json<ActionData>({ error: "Failed to update data" });
          }
        }
      }
      if (data.removed.length) {
        const { count } = await deleteQuestions(data.removed);
        if (count < 1)
          return json<ActionData>({ error: "Failed to remove questions" });
      }
      return json<ActionData>({ success: true });
    }
    case "PUT": {
      const data = {} as Questionnaire;
      formData.forEach((value, key) => {
        // @ts-ignore
        data[key] = value;
      });
      if (!data.name || !data.status) {
        return json<ActionData>({ error: "Invalid Request" });
      } else if (formId) {
        const qre = await updateQuestionnaire(formId, {
          ...data,
          description: data.description || null,
          expiresAt: dayjs(data.expiresAt).toDate(),
        });
        return json({ data: qre });
      }
    }
    default:
      return json<ActionData>({ error: "Method not allowed" });
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = (await getUserId(request)) || "";

  const code = params.formId;
  if (!code) return redirect("/workspace?error=notfound");

  const meta = await getQuestionnaire({
    code,
    userId,
    include: { questions: true },
  });
  if (!meta) return redirect("/workspace?error=notfound");

  const answers = await getAnswers({ questionnaireId: meta.id });

  const _respondents = {} as { [key: string]: Respondent };
  answers.forEach(({ respondent }) => {
    _respondents[respondent.id] = respondent;
  });

  const respondents = objArrSort(
    Object.values(_respondents),
    "createdAt",
    "desc"
  );

  const questions = objArrSort(meta.questions as Question[], "order").map(
    (question) =>
      ({
        ...question,
        answers: answers.filter((answer) => answer.questionId === question.id),
        modified: false,
      } as WorkspaceData["questions"][number])
  );

  delete meta.questions;

  return json<WorkspaceData>({ meta, questions, respondents });
};

export default function FormDetailLayout() {
  const { meta, questions, respondents } = useLoaderData() as WorkspaceData;

  const [tab, setTab] = useState("questions");

  const setQuestions = useSetRecoilState(questionsStore);

  useEffect(() => {
    document.title = `Remixionnaire | ${meta.name}`;
    const tmp = questions.map((q) => ({ ...q, answers: undefined }));
    setQuestions(tmp);
  }, []);

  const renderContent = () => {
    switch (tab) {
      case "questions":
        return (
          <div>
            <Container
              className="max-w-full"
              css={{
                backgroundColor: `#${meta.theme}`,
                padding: "4rem 0px 4rem 0px",
              }}
            >
              <Container sm>
                <Text h1>{meta.name}</Text>
                <Text>{meta.description}</Text>
              </Container>
            </Container>
            <Spacer y={1.5} />
            <QuestionsEditor meta={meta} />
            <Spacer y={4.2} />
          </div>
        );
      case "answers":
        return <AnswersTable respondents={respondents} questions={questions} />;
      case "settings":
        return (
          <Container sm>
            <Spacer y={1.5} />
            <Text h1 className="heading-text">
              Form Settings
            </Text>
            <Spacer />
            <QuestionSetting meta={meta} />
          </Container>
        );
    }
  };

  return (
    <div>
      <Container
        css={{ backgroundColor: "$backgroundDeep" }}
        className="context-menu max-w-full"
      >
        <Link
          color={tab == "questions" ? "primary" : "text"}
          style={{ userSelect: "none" }}
          onClick={() => setTab("questions")}
          className={clsx("context-option", {
            "option-selected": tab == "questions",
          })}
        >
          Questions
        </Link>
        <Link
          color={tab == "answers" ? "primary" : "text"}
          style={{ userSelect: "none" }}
          onClick={() => setTab("answers")}
          className={clsx("context-option", {
            "option-selected": tab == "answers",
          })}
        >
          Answers
        </Link>
        <Link
          color={tab == "settings" ? "primary" : "text"}
          style={{ userSelect: "none" }}
          onClick={() => setTab("settings")}
          className={clsx("context-option", {
            "option-selected": tab == "settings",
          })}
        >
          Settings
        </Link>
      </Container>
      {renderContent()}
    </div>
  );
}
