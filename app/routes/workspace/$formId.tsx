/* eslint-disable react-hooks/exhaustive-deps */
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { QuestionnaireData, Question } from "~/types";

// Remix Libs
import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

// React Libs
import { Container, Link, Spacer, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
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
import { getQuestionnaire } from "~/models/questionnaire.server";

// UI Components
import AnswersTable from "~/components/AnswersTable";
import QuestionsEditor from "~/components/QuestionsEditor";

type SubmitData = {
  modified: Omit<Question, "answers">[];
  newEntry: Omit<Question, "answers">[];
  removed: string[];
};

type ActionData = {
  success?: boolean;
  error?: string;
};

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "POST":
      const formData = await request.formData();
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
    default:
      return json<ActionData>({ error: "Method not allowed" });
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = (await getUserId(request)) || "";

  const code = params.formId;
  if (!code) return redirect("/workspace?error=notfound");

  const qre = await getQuestionnaire({ code, userId });
  if (!qre) return redirect("/workspace?error=notfound");

  const answers = await getAnswers({ questionnaireId: qre.id });

  const questions = objArrSort(qre.questions, "order").map(
    (question) =>
      ({
        ...question,
        answers: answers.filter((answer) => answer.questionId === question.id),
        modified: false,
      } as QuestionnaireData["questions"][number])
  );

  return json<QuestionnaireData>({
    // @ts-expect-error
    meta: { ...qre, questions: undefined, respondents: undefined },
    respondents: qre.respondents,
    questions,
  });
};

export default function FormDetailLayout() {
  const data = useLoaderData() as QuestionnaireData;

  const [tab, setTab] = useState("questions");

  const setQuestions = useSetRecoilState(questionsStore);

  useEffect(() => {
    document.title = `Remixionnaire | ${data.meta.name}`;
    setQuestions(data.questions);
  }, []);

  const renderContent = () => {
    switch (tab) {
      case "questions":
        return (
          <div>
            <Container
              className="max-w-full"
              css={{
                backgroundColor: `#${data.meta.theme}`,
                padding: "4rem 0px 4rem 0px",
              }}
            >
              <Container sm>
                <Text h1>{data.meta.name}</Text>
                <Text>{data.meta.description}</Text>
              </Container>
            </Container>
            <Spacer y={1.5} />
            <QuestionsEditor meta={data.meta} />
            <Spacer y={4.2} />
          </div>
        );
      case "answers":
        return (
          <AnswersTable
            respondents={data.respondents}
            questions={data.questions}
          />
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
          color={tab == "setting" ? "primary" : "text"}
          style={{ userSelect: "none" }}
          onClick={() => setTab("setting")}
          className={clsx("context-option", {
            "option-selected": tab == "setting",
          })}
        >
          Setting
        </Link>
      </Container>
      {renderContent()}
    </div>
  );
}
