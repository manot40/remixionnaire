import type { LoaderFunction } from "@remix-run/node";
import type {
  Questionnaire,
  Question,
  Respondent,
  Answer,
} from "@prisma/client";

import {
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import { Container, Link, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";
import clsx from "clsx";

import { getUserId } from "~/session.server";
import { getQuestionnaire } from "~/models/questionnaire.server";
import { getAnswers } from "~/models/answer.server";
import { objArrSort } from "~/libs";
import AnswersTable from "~/components/AnswersTable";

type LoaderData = {
  meta: Questionnaire;
  respondents: Respondent[];
  questions: Question[];
  answers: Answer[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = (await getUserId(request)) || "";

  const code = params.formId;
  if (!code) return redirect("/workspace?error=notfound");

  const qre = await getQuestionnaire({ code, userId });
  if (!qre) return redirect("/workspace?error=notfound");

  const answers = await getAnswers({ questionnaireId: qre.id });

  return json<LoaderData>({
    // @ts-ignore
    meta: { ...qre, questions: undefined, respondents: undefined },
    respondents: qre.respondents,
    questions: qre.questions,
    answers,
  });
};

export default function FormDetailLayout() {
  const data = useLoaderData() as LoaderData;
  // const actionData = useActionData();

  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState("questions");

  useEffect(() => {
    document.title = `Remixionnaire | ${data.meta.name}`;
    const tabQuery = searchParams.get("tab");
    if (tabQuery) setTab(tabQuery);
  }, [searchParams]);

  const renderContent = () => {
    switch (tab) {
      case "questions":
        return (
          <Container
            className="max-w-full"
            css={{
              backgroundColor: `#${data.meta.theme}`,
              padding: "4rem 0px 4rem 0px",
            }}
          >
            <Container sm>
              <Text css={{ color: "#fff" }} h1>
                {data.meta.name}
              </Text>
            </Container>
          </Container>
        );
      case "answers":
        return (
          <AnswersTable
            respondents={objArrSort(data.respondents, "id")}
            questions={objArrSort(data.questions, "id")}
            answers={data.answers}
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
          color={tab == "options" ? "primary" : "text"}
          style={{ userSelect: "none" }}
          onClick={() => setTab("options")}
          className={clsx("context-option", {
            "option-selected": tab == "options",
          })}
        >
          Options
        </Link>
      </Container>
      {renderContent()}
    </div>
  );
}
