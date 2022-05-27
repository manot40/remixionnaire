import type { QuestionnaireData } from "~/types";

import {
  Container,
  Card,
  Spacer,
  Input,
  Textarea,
  Radio,
  Checkbox,
  Button,
  Link,
} from "@nextui-org/react";
import { useState } from "react";

type TProps = {
  meta: QuestionnaireData["meta"];
  questions: QuestionnaireData["questions"];
};

export default function QuestionsEditor({
  meta: _meta,
  questions: _questions,
}: TProps) {
  // Main state
  const [meta, setMeta] = useState(_meta);
  const [questions, setQuestions] = useState(_questions);

  const listChanged = (newval: string, qIdx: number, cIdx: number) => {
    const tmp = [...questions];
    // @ts-ignore
    tmp[qIdx].list[cIdx] = newval;
    setQuestions(tmp);
  };

  const listAdded = (id: string) => {
    const idx = questions.findIndex((q) => q.id === id);
    if (idx !== -1) {
      const tmp2 = [...questions];
      // @ts-ignore
      tmp2[idx] = { ...tmp2[idx], list: [...tmp2[idx].list, ""] };
      setQuestions(tmp2);
    }
  };

  const listRemoved = (id: string) => {
    const idx = questions.findIndex((q) => q.id === id);
    if (idx !== -1) {
      const tmp2 = [...questions];
      // @ts-ignore
      tmp2[idx] = { ...tmp2[idx], list: tmp2[idx].list.slice(0, -1) };
      setQuestions(tmp2);
    }
  };

  const questionContentRender = (qIdx: number) => {
    const { id, type } = questions[qIdx];
    const list = questions[qIdx].list as [];
    if (type === "SHORT_TEXT") {
      return <Input underlined placeholder="Short Text Answer Input" />;
    }
    if (type === "TEXT") {
      return <Textarea underlined placeholder="Text Answer Input" />;
    }
    if (type === "RADIO") {
      return list?.map((choice, cIdx) => (
        <div
          key={cIdx}
          className="w-full"
          style={{ display: "flex", marginTop: "18px", alignItems: "center" }}
        >
          <Radio disabled value={choice} size="sm" />
          <Spacer x={0.25} />
          <Input
            underlined
            fullWidth
            required
            value={choice}
            placeholder={`Option ${cIdx + 1}`}
            onChange={(e) => listChanged(e.target.value, qIdx, cIdx)}
          />
          <Button color="error" light auto onClick={() => listRemoved(id)}>
            {/* @ts-ignore */}
            <ion-icon name="close" style={{ fontSize: "21px" }} />
          </Button>
        </div>
      ));
    }
    if (type === "CHECKBOX") {
      return list?.map((choice, cIdx) => (
        <div
          key={cIdx}
          className="w-full"
          style={{ display: "flex", marginTop: "18px", alignItems: "center" }}
        >
          <Checkbox isDisabled size="sm" />
          <Spacer x={0.5} />
          <Input
            underlined
            fullWidth
            required
            value={choice}
            placeholder={`Option ${cIdx + 1}`}
            onChange={(e) => listChanged(e.target.value, qIdx, cIdx)}
          />
          <Button color="error" light auto onClick={() => listRemoved(id)}>
            {/* @ts-ignore */}
            <ion-icon name="close" style={{ fontSize: "21px" }} />
          </Button>
        </div>
      ));
    }
    return null;
  };
  return (
    <Container sm>
      {questions.map((question, idx) => (
        <Card
          css={{ marginBottom: "$10", padding: "12px 6px 24px 6px" }}
          key={question.id}
        >
          <Input
            underlined
            animated={false}
            placeholder={question.name}
            style={{ fontSize: "1rem", fontWeight: 600 }}
            className="question-title-input"
          />
          <Spacer y={0.5} />
          {questionContentRender(idx)}
          {question.list && (
            <>
              <Spacer />
              <Link
                onClick={() => listAdded(question.id)}
                css={{ fontSize: "14px" }}
              >
                + Insert new
              </Link>
            </>
          )}
        </Card>
      ))}
    </Container>
  );
}
