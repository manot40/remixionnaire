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
  Divider,
  Tooltip,
  Switch,
  Text,
} from "@nextui-org/react";
import cuid from "cuid";
import { useRecoilState } from "recoil";

import Select from "./Select";
import { questionsStore } from "~/store";

type TProps = {
  questions: QuestionnaireData["questions"];
};

export default function QuestionsEditor({ questions: _questions }: TProps) {
  // Main state
  const [questions, setQuestions] = useRecoilState(questionsStore);

  const optionAdd = (id: string) => {
    const idx = questions.findIndex((q) => q.id === id);
    if (idx !== -1) {
      const tmp = [...questions];
      // @ts-ignore
      tmp[idx] = { ...tmp[idx], list: [...tmp[idx].list, ""] };
      setQuestions(tmp);
    }
  };

  const optionChange = (newval: string, qIdx: number, cIdx: number) => {
    const tmp = [...questions];
    // @ts-ignore
    tmp[qIdx].list[cIdx] = newval;
    setQuestions(tmp);
  };

  const optionRemove = (id: string) => {
    const idx = questions.findIndex((q) => q.id === id);
    if (idx !== -1) {
      const tmp = [...questions];
      // @ts-ignore
      tmp[idx] = { ...tmp[idx], list: tmp[idx].list?.slice(0, -1) };
      setQuestions(tmp);
    }
  };

  const insertQuestion = () => {
    const tmp = [...questions];
    tmp.push({
      id: cuid(),
      name: "",
      order: tmp.length + 1,
      type: "SHORT_TEXT",
      required: false,
      description: null,
      list: [],
      questionnaireId: "",
      updatedAt: new Date(),
      answers: [],
    });
    setQuestions(tmp);
  };

  const deleteQuestion = (id: string) => {
    const idx = questions.findIndex((q) => q.id === id);
    if (idx !== -1) {
      const tmp = [...questions];
      tmp.splice(idx, 1);
      setQuestions(tmp);
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
      return list?.map((option, oIdx) => (
        <div
          key={oIdx}
          className="w-full"
          style={{ display: "flex", marginTop: "18px", alignItems: "center" }}
        >
          <Radio disabled value={option} size="sm" />
          <Spacer x={0.25} />
          <Input
            underlined
            fullWidth
            required
            value={option}
            placeholder={`Option ${oIdx + 1}`}
            onChange={(e) => optionChange(e.target.value, qIdx, oIdx)}
          />
          <Button color="error" light auto onClick={() => optionRemove(id)}>
            {/* @ts-ignore */}
            <ion-icon name="close" style={{ fontSize: "21px" }} />
          </Button>
        </div>
      ));
    }
    if (type === "CHECKBOX") {
      return list?.map((option, oIdx) => (
        <div
          key={oIdx}
          className="w-full"
          style={{ display: "flex", marginTop: "18px", alignItems: "center" }}
        >
          <Checkbox isDisabled size="sm" />
          <Spacer x={0.5} />
          <Input
            underlined
            fullWidth
            required
            value={option}
            placeholder={`Option ${oIdx + 1}`}
            onChange={(e) => optionChange(e.target.value, qIdx, oIdx)}
          />
          <Button color="error" light auto onClick={() => optionRemove(id)}>
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
          css={{ marginBottom: "$10", padding: "12px 6px 0px 6px" }}
          key={idx}
        >
          <Card.Body style={{ minHeight: "12rem" }}>
            <div className="w-full" style={{ display: "flex" }}>
              <Input
                fullWidth
                underlined
                animated={false}
                className="question-title-input"
                placeholder={question.name || "Question Name"}
                style={{ fontSize: "1rem", fontWeight: 600 }}
              />
              <Select
                options={[
                  { value: "SHORT_TEXT", label: "Short Text" },
                  { value: "TEXT", label: "Text" },
                  { value: "RADIO", label: "Radio" },
                  { value: "CHECKBOX", label: "Checkbox" },
                ]}
                placeholder="Question Type"
                onChange={(e) => {
                  const tmp = [...questions];
                  tmp[idx] = { ...tmp[idx], type: e as any };
                  setQuestions(tmp);
                }}
                style={{ width: "25%" }}
              />
            </div>
            <Spacer y={0.5} />
            {questionContentRender(idx)}
            {!/TEXT/.test(question.type) && (
              <>
                <Spacer />
                <Link
                  onClick={() => optionAdd(question.id)}
                  css={{ fontSize: "14px" }}
                >
                  + Insert option
                </Link>
              </>
            )}
            <Spacer y={!/TEXT/.test(question.type) ? 1 : 1.5} />
          </Card.Body>
          <Divider />
          <Card.Footer>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0px 12px 0px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text size={14} css={{ margin: "1px 8px 0px 0px" }}>
                  Required
                </Text>
                <Switch
                  size="sm"
                  checked={question.required}
                  onChange={({ target }) =>
                    setQuestions((prev) => {
                      const tmp = [...prev];
                      tmp[idx] = { ...tmp[idx], required: target.checked };
                      return tmp;
                    })
                  }
                />
              </div>
              <div style={{ display: "flex" }}>
                <Tooltip content="Add Description">
                  <Link color="text">
                    {/* @ts-ignore */}
                    <ion-icon
                      name="text-outline"
                      style={{ fontSize: "21px", marginRight: "6px" }}
                    />
                  </Link>
                </Tooltip>
                <Spacer x={1.5} />
                <Tooltip color="primary" content="Duplicate Question">
                  <Link>
                    {/* @ts-ignore */}
                    <ion-icon
                      name="copy-outline"
                      style={{ fontSize: "24px", marginRight: "6px" }}
                    />
                  </Link>
                </Tooltip>
                <Spacer x={0.5} />
                <Tooltip color="error" content="Delete Question">
                  <Link
                    onClick={() => deleteQuestion(question.id)}
                    color={"error"}
                  >
                    {/* @ts-ignore */}
                    <ion-icon
                      name="trash-outline"
                      style={{ fontSize: "24px", marginRight: "6px" }}
                    />
                  </Link>
                </Tooltip>
              </div>
            </div>
          </Card.Footer>
        </Card>
      ))}
      <Card
        css={{
          bottom: "16px",
          left: "50%",
          transform: `translateX(${-50}%)`,
          width: "24rem",
          position: "fixed",
          zIndex: 9999,
          background: "$background",
          border: "1px solid $border",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link onClick={insertQuestion} css={{ alignItems: "center" }}>
            {/* @ts-ignore */}
            <ion-icon
              name="add"
              style={{ fontSize: "18px", marginRight: "6px" }}
            />{" "}
            <span style={{ fontSize: "14px" }}>Insert Question</span>
          </Link>
          <Button
            flat
            size="sm"
            css={{ width: "2.4rem" }}
            onClick={() => console.log(questions)}
          >
            Submit
          </Button>
        </div>
      </Card>
    </Container>
  );
}
