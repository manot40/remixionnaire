import type { Answer, Questionnaire, Respondent } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { PublicForm, Question } from "~/types";

import {
  Text,
  Container,
  Spacer,
  Input,
  Textarea,
  Radio,
  Checkbox,
  Button,
  Loading,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { redirect, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";

import { objArrSort } from "~/libs";
import {
  getRespondentByMail,
  createRespondent,
} from "~/models/respondents.server";
import { getQuestionnaire } from "~/models/questionnaire.server";
import { checkIfAnswered, createAnswers } from "~/models/answer.server";

import QuestionCard from "~/components/QuestionCard";
import RespondentModal from "~/components/RespondentModal";
import ProfilePopover from "~/components/ProfilePopover";

type LoaderData = {
  questions: PublicForm[];
  meta: Questionnaire;
};

type SubmitData = Omit<Answer, "id" | "answeredAt">[];

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const { formId: questionnaireId } = params;

  const data = formData.get("data");
  const email = formData.get("email");

  if (questionnaireId) {
    if (request.method == "PUT") {
      if (typeof email == "string") {
        const respondent = await getRespondentByMail(email);
        if (respondent) {
          const isAnswered = await checkIfAnswered(
            respondent.id,
            questionnaireId
          );
          return isAnswered ? json({ error: 403 }) : json({ ...respondent });
        } else return json({ error: 404 });
      }

      if (typeof data === "string") {
        const _data = JSON.parse(data) as any;
        const respondent = await createRespondent(_data);
        return json({ ...respondent });
      }
    }

    if (request.method == "POST") {
      const answers = JSON.parse(data as string) as SubmitData;
      const { count } = await createAnswers(answers);
      if (count !== answers.length) return json({ error: 500 });
      return redirect("/?success=true");
    }
  }

  return json({ error: "Method not allowed" });
};

export const loader: LoaderFunction = async ({ params }) => {
  const { formId: code } = params;
  if (!code) return redirect("/?error=notfound");

  const meta = await getQuestionnaire({
    code,
    status: "ACTIVE",
    include: { questions: true },
  });
  if (!meta) return redirect("/?error=notfound");

  const questions: PublicForm[] = objArrSort(
    meta.questions as Question[],
    "order"
  ).map((q) => ({
    ...q,
    answer: "",
    questionnaireId: meta.id,
  }));

  delete meta.questions;

  return json<LoaderData>({ questions, meta });
};

export default function InputForm() {
  const { meta, questions: _questions } = useLoaderData() as LoaderData;
  const fetcher = useFetcher();

  let initialQ = [..._questions];

  const [questions, setAnswers] = useState<LoaderData["questions"]>([]);
  const [respondent, setRespondent] = useState<Partial<Respondent>>({});

  function changePrimitive<T extends Partial<Answer>>(idx: number, object: T) {
    setAnswers((prev) => {
      const tmp = [...prev];
      tmp[idx] = { ...tmp[idx], ...object };
      return tmp;
    });
  }

  function isAnswerNG(q: PublicForm) {
    if (/\[\]/.test(q.answer) && q.required) return true;
    return q.required && q.answer.length < 1;
  }

  const submit = () => {
    const missing = questions.find((q) => isAnswerNG(q));
    if (missing) {
      toast.error("Please answer all required questions");
      return;
    }

    const data: SubmitData = questions.map((q) => ({
      answer: q.answer,
      questionId: q.id,
      questionnaireId: q.questionnaireId,
      respondentId: q.respondentId as string,
    }));

    fetcher.submit({ data: JSON.stringify(data) }, { method: "post" });
  };

  const questionContent = (idx: number) => {
    const { answer, type } = questions[idx];

    if (type === "SHORT_TEXT") {
      return (
        <Input
          underlined
          placeholder="Answer"
          value={answer}
          onChange={({ target }) =>
            changePrimitive(idx, { answer: target.value })
          }
        />
      );
    }

    if (type === "TEXT") {
      return (
        <Textarea
          underlined
          placeholder="Answer"
          value={answer}
          onChange={({ target }) =>
            changePrimitive(idx, { answer: target.value })
          }
        />
      );
    }

    if (!/TEXT/.test(type)) {
      return type === "RADIO" ? (
        <Radio.Group
          value={answer}
          onChange={(e) => changePrimitive(idx, { answer: e + "" })}
        >
          {_questions[idx].list.map((item, i) => (
            <Radio key={i} value={item} size="sm">
              <Spacer x={0.5} />
              {item}
            </Radio>
          ))}
        </Radio.Group>
      ) : (
        <>
          <Spacer />
          <Checkbox.Group
            value={answer ? JSON.parse(answer) : []}
            onChange={(e) =>
              changePrimitive(idx, { answer: JSON.stringify(e) })
            }
          >
            {_questions[idx].list.map((item, i) => (
              <Checkbox key={i} value={item} size="sm">
                <Spacer x={0.5} />
                {item}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </>
      );
    }
    return null;
  };

  return (
    <div>
      <Container
        className="max-w-full"
        css={{
          backgroundColor: `#${meta.theme}`,
          padding: "8rem 0px 8rem 0px",
        }}
      >
        <Container sm css={{ position: "relative" }}>
          <ProfilePopover
            name={respondent.name}
            style={{ position: "absolute", top: "-7rem", right: "1rem" }}
          />
          <Text h1>{meta.name}</Text>
          <Text>{meta.description}</Text>
        </Container>
      </Container>
      <Spacer y={1.5} />
      <Container sm>
        {questions?.map((question, idx) => (
          <QuestionCard
            key={idx}
            css={
              isAnswerNG(question)
                ? { border: "1px solid $red500" }
                : { border: "1px solid transparent" }
            }
          >
            <QuestionCard.Header>
              <Container css={{ padding: 0, userSelect: "none" }}>
                <Text size={18} b>
                  {question.name}{" "}
                  {question.required ? (
                    <Text css={{ color: "$error" }} small>
                      (Required)
                    </Text>
                  ) : null}
                </Text>
                {typeof question.description === "string" && (
                  <Text size={14} css={{ marginTop: "$5" }}>
                    {question.description}
                  </Text>
                )}
              </Container>
            </QuestionCard.Header>
            <QuestionCard.Body>
              {/TEXT/.test(question.type) && <Spacer />}
              {questionContent(idx)}
              {/* <Spacer y={!/TEXT/.test(question.type) ? 1 : 1.5} /> */}
            </QuestionCard.Body>
          </QuestionCard>
        ))}
        {questions.length && (
          <Container display="flex" css={{ padding: "0 0 8rem 0" }}>
            <Button disabled={fetcher.state !== "idle"} onClick={submit}>
              {fetcher.state !== "idle" ? (
                <Loading type="points-opacity" color="currentColor" size="sm" />
              ) : (
                "Send Answer"
              )}
            </Button>
            <Spacer x={0.7} />
            <Button
              flat
              auto
              color="error"
              onClick={() => setAnswers(initialQ)}
            >
              Reset
            </Button>
          </Container>
        )}
      </Container>
      <RespondentModal
        onSubmit={(resp) => {
          initialQ = initialQ.map((q) => ({
            ...q,
            respondentId: resp.id,
          }));
          setRespondent(resp);
          setAnswers(initialQ);
        }}
      />
    </div>
  );
}
