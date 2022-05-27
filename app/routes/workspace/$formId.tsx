import type { LoaderFunction } from "@remix-run/node";
import type { QuestionnaireData } from "~/types";

// Remix Libs
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

// React Libs
import { Container, Link, Spacer, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import clsx from "clsx";

// Custom libs and helper
import { objArrSort } from "~/libs";
import { questionsStore } from "~/store";
import { getUserId } from "~/session.server";
import { getAnswers } from "~/models/answer.server";
import { getQuestionnaire } from "~/models/questionnaire.server";

// UI Components
import AnswersTable from "~/components/AnswersTable";
import QuestionsEditor from "~/components/QuestionsEditor";

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
  // const actionData = useActionData();

  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState("questions");

  const setQuestion = useSetRecoilState(questionsStore);

  useEffect(() => {
    setQuestion(data.questions);
  }, []);

  useEffect(() => {
    document.title = `Remixionnaire | ${data.meta.name}`;
    const tabQuery = searchParams.get("tab");
    if (tabQuery) setTab(tabQuery);
  }, [searchParams]);

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
                <Text h1>
                  {data.meta.name}
                </Text>
                <Text>
                  {data.meta.description}
                </Text>
              </Container>
            </Container>
            <Spacer y={1.5} />
            <QuestionsEditor questions={data.questions} />
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
