import type { QuestionnaireData } from "~/types";
import type { Question } from "@prisma/client";

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

import Select from "../Select";
import { questionsStore } from "~/store";
import QuestionsEditorPanel from "./panel";

type TProps = {
  questions: QuestionnaireData["questions"];
};

export default function QuestionsEditor({ questions: _questions }: TProps) {
  // Main state
  const [questions, setQuestions] = useRecoilState(questionsStore);

  const optionAdd = (qIdx: number) => {
    const tmp = [...questions];
    // @ts-ignore
    tmp[qIdx] = { ...tmp[qIdx], list: [...tmp[qIdx].list, ""] };
    setQuestions(tmp);
  };

  const optionChange = (newval: string, qIdx: number, oIdx: number) => {
    setQuestions((prev) => {
      const tmp = [...prev];
      tmp[qIdx] = { ...tmp[qIdx], list: [...tmp[qIdx].list] };
      // @ts-ignore
      tmp[qIdx].list[oIdx] = newval;
      return tmp;
    });
  };

  const optionRemove = (qIdx: number, oIdx: number) => {
    const tmp = [...questions];
    tmp[qIdx] = { ...tmp[qIdx], list: [...tmp[qIdx].list] };
    // @ts-ignore
    tmp[qIdx].list?.splice(oIdx, 1);
    setQuestions(tmp);
  };

  const insertQuestion = (type: Question["type"]) => {
    setQuestions((prev) => [
      ...prev,
      {
        id: cuid(),
        type,
        name: "",
        order: 45,
        required: false,
        description: null,
        list: [],
        questionnaireId: "",
        updatedAt: new Date(),
        answers: [],
      },
    ]);
  };

  const deleteQuestion = (qIdx: number) => {
    setQuestions((prev) => {
      const tmp = [...prev];
      tmp.splice(qIdx, 1);
      return tmp;
    });
  };

  const questionContent = (qIdx: number) => {
    const { type } = questions[qIdx];
    const list = questions[qIdx].list as [];
    if (type === "SHORT_TEXT") {
      return <Input disabled underlined placeholder="Text Answer" />;
    }
    if (type === "TEXT") {
      return <Textarea disabled underlined placeholder="Long Text Answer" />;
    }
    if (!/TEXT/.test(type)) {
      return list?.map((option, oIdx) => (
        <div
          key={oIdx}
          className="w-full"
          style={{ display: "flex", marginTop: "18px", alignItems: "center" }}
        >
          {type === "RADIO" ? (
            <Radio disabled value={option} size="sm" />
          ) : (
            <Checkbox isDisabled size="sm" />
          )}
          <Spacer x={0.25} />
          <Input
            underlined
            fullWidth
            required
            value={option}
            placeholder={`Option ${oIdx + 1}`}
            onChange={(e) => optionChange(e.target.value, qIdx, oIdx)}
          />
          <Button
            color="error"
            light
            auto
            onClick={() => optionRemove(qIdx, oIdx)}
          >
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
      {questions.length ? (
        questions.map((question, idx) => (
          <Card
            css={{ marginBottom: "$10", padding: "12px 6px 0px 6px" }}
            key={idx}
          >
            <Card.Body style={{ minHeight: "12rem" }}>
              <Container
                wrap="nowrap"
                css={{
                  width: "100%",
                  padding: "$0",
                  display: "block",
                  "@sm": {
                    display: "flex",
                  },
                }}
              >
                <Input
                  fullWidth
                  underlined
                  animated={false}
                  className="question-title-input"
                  placeholder={"Question Name"}
                  value={question.name}
                  onChange={({ target }) => {
                    setQuestions((prev) => {
                      const tmp = [...prev];
                      tmp[idx] = { ...tmp[idx], name: target.value };
                      return tmp;
                    });
                  }}
                  style={{ fontSize: "1rem", fontWeight: 600 }}
                />
                <Spacer y={0.5} />
                <Select
                  options={[
                    { value: "SHORT_TEXT", label: "Text" },
                    { value: "TEXT", label: "Long Text" },
                    { value: "RADIO", label: "Radio" },
                    { value: "CHECKBOX", label: "Checkbox" },
                  ]}
                  selected={question.type}
                  placeholder="Question Type"
                  onChange={(e) => {
                    const tmp = [...questions];
                    tmp[idx] = { ...tmp[idx], type: e as any };
                    setQuestions(tmp);
                  }}
                  style={{ width: "25%" }}
                />
              </Container>
              {/TEXT/.test(question.type) && <Spacer />}
              {questionContent(idx)}
              {!/TEXT/.test(question.type) && (
                <>
                  <Spacer />
                  <Link
                    onClick={() => optionAdd(idx)}
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
                    <Link onClick={() => deleteQuestion(idx)} color={"error"}>
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
        ))
      ) : (
        <Text
          css={{
            textAlign: "center",
            color: "$gray500",
            letterSpacing: "$normal",
          }}
        >
          No Questions yet
          <br />
          Click on the + button to add a question.
        </Text>
      )}
      <QuestionsEditorPanel onInsert={insertQuestion} />
    </Container>
  );
}
