import type { QuestionnaireData, Question } from "~/types";

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
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";

import Select from "../Select";
import { questionsStore } from "~/store";
import QuestionsEditorPanel from "./panel";

type TProps = {
  meta: QuestionnaireData["meta"];
};

export default function QuestionsEditor({ meta }: TProps) {
  const fetcher = useFetcher();

  // Main state
  const [removed, setRemoved] = useState([] as string[]);
  const [questions, setQuestions] = useRecoilState(questionsStore);

  // Watch for fetcher response
  useEffect(() => {
    if (fetcher.data?.success) toast.success("Updated Successfully");
    if (fetcher.data?.error) toast.error(fetcher.data.error);
  }, [fetcher.data]);

  // Allowing to change the question primitives
  function changePrimitive<T = Partial<Question>>(idx: number, object: T) {
    setQuestions((prev) => {
      const tmp = [...prev];
      tmp[idx] = { ...tmp[idx], ...object };
      !isNew(tmp[idx].modified) && (tmp[idx].modified = true);
      return tmp;
    });
  }

  const insertQuestion = (type: Question["type"]) => {
    setQuestions((prev) => [
      ...prev,
      {
        type,
        id: "",
        name: "",
        order: 45,
        required: false,
        description: null,
        list: [],
        questionnaireId: meta.id,
        updatedAt: new Date(),
        answers: [],
      },
    ]);
  };

  const deleteQuestion = (qIdx: number) => {
    setQuestions((prev) => {
      setRemoved([...removed, prev[qIdx].id]);
      const tmp = [...prev];
      tmp.splice(qIdx, 1);
      return tmp;
    });
  };

  const optionAdd = (qIdx: number) => {
    const tmp = [...questions];
    tmp[qIdx] = { ...tmp[qIdx], list: [...tmp[qIdx].list, ""] };
    !isNew(tmp[qIdx].modified) && (tmp[qIdx].modified = true);
    setQuestions(tmp);
  };

  const optionChange = (newval: string, qIdx: number, oIdx: number) => {
    setQuestions((prev) => {
      const tmp = [...prev];
      tmp[qIdx] = { ...tmp[qIdx], list: [...tmp[qIdx].list] };
      !isNew(tmp[qIdx].modified) && (tmp[qIdx].modified = true);
      tmp[qIdx].list[oIdx] = newval;
      return tmp;
    });
  };

  const optionRemove = (qIdx: number, oIdx: number) => {
    const tmp = [...questions];
    tmp[qIdx] = { ...tmp[qIdx], list: [...tmp[qIdx].list] };
    !isNew(tmp[qIdx].modified) && (tmp[qIdx].modified = true);
    tmp[qIdx].list?.splice(oIdx, 1);
    setQuestions(tmp);
  };

  const submitChange = () => {
    const _questions = questions.map((q) => ({ ...q, answers: undefined }));

    const submitData = {
      modified: [] as typeof _questions,
      newEntry: [] as typeof _questions,
      removed: [...removed],
    };

    _questions.forEach((q) => {
      if (typeof q.modified === "boolean") {
        if (q.modified)
          submitData.modified.push({
            ...q,
            modified: undefined,
          });
      } else {
        const tmp = { ...q, id: undefined };
        // @ts-ignore
        submitData.newEntry.push(tmp);
      }
    });

    fetcher.submit({ data: JSON.stringify(submitData) }, { method: "post" });
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
                  placeholder="Question Name"
                  value={question.name}
                  onChange={({ target }) =>
                    changePrimitive(idx, { name: target.value })
                  }
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
                  onChange={(e) => changePrimitive(idx, { type: e })}
                  style={{ width: "25%" }}
                />
              </Container>
              {typeof question.description === "string" && (
                <Input
                  underlined
                  className="question-title-input"
                  placeholder="Description"
                  value={question.description}
                  style={{ fontSize: ".75rem" }}
                  onChange={({ target }) =>
                    changePrimitive(idx, { description: target.value })
                  }
                />
              )}
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
                      changePrimitive(idx, { required: target.checked })
                    }
                  />
                </div>
                <div style={{ display: "flex" }}>
                  <Tooltip content="Add/Remove Description">
                    <Link
                      color="text"
                      onClick={() =>
                        changePrimitive(idx, {
                          description:
                            typeof question.description === "string"
                              ? null
                              : "",
                        })
                      }
                    >
                      {/* @ts-ignore */}
                      <ion-icon
                        name="text-outline"
                        style={{ fontSize: "21px", marginRight: "6px" }}
                      />
                    </Link>
                  </Tooltip>
                  <Spacer x={0.5} />
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
      <QuestionsEditorPanel onInsert={insertQuestion} onSubmit={submitChange} />
    </Container>
  );
}

function isNew(arg: boolean | undefined) {
  return typeof arg === "undefined";
}
