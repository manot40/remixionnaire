import type { WorkspaceData, Question } from "~/types";

import {
  Container,
  Spacer,
  Input,
  Textarea,
  Radio,
  Checkbox,
  Tooltip,
  Button,
  Link,
  Switch,
  Text,
} from "@nextui-org/react";
import cuid from "cuid";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";

import Select from "../Select";
import { questionsStore } from "~/store";
import QuestionsEditorPanel from "./panel";
import QuestionCard from "../QuestionCard";
import ConfirmPop from "../ConfirmPop";

type TProps = {
  meta: WorkspaceData["meta"];
};

export default function QuestionsEditor({ meta }: TProps) {
  const fetcher = useFetcher();

  // Main state
  const [removed, setRemoved] = useState([] as string[]);
  const [questions, setQuestions] = useRecoilState(questionsStore);

  // Watch for fetcher response
  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success("Updated Successfully");
      setRemoved([]);
    }
    if (fetcher.data?.error) toast.error(fetcher.data.error);
  }, [fetcher.data]);

  // Allowing to change the question primitives
  function changePrimitive<T extends Partial<Question>>(
    idx: number,
    object: T
  ) {
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
        id: cuid(),
        name: "",
        order: questions.length,
        required: false,
        description: null,
        list: [],
        questionnaireId: meta.id,
        updatedAt: new Date(),
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
    const _questions = [...questions];
    const _problematic = [] as number[];

    const submitData = {
      modified: [] as typeof _questions,
      newEntry: [] as typeof _questions,
      removed: [...removed],
    };

    _questions.forEach((q, idx) => {
      const isListOkay = q.list?.find((o) => o === "") === undefined;
      if (q.name && isListOkay) {
        if (typeof q.modified === "boolean") {
          q.modified &&
            submitData.modified.push({
              ...q,
              modified: undefined,
            });
        } else {
          submitData.newEntry.push(q);
        }
        _questions[idx] = { ...q, modified: false };
      } else {
        _problematic.push(idx);
      }
    });

    const multiInvalid =
      _problematic.length > 1 ? `and ${_problematic.length - 1} other` : "";
    _problematic.length
      ? toast.error(
          `Question #${_problematic[0] + 1} ${multiInvalid} has invalid data`
        )
      : finish();

    function finish() {
      fetcher.submit({ data: JSON.stringify(submitData) }, { method: "post" });
      setQuestions(_questions);
    }
  };

  const questionContent = (qIdx: number) => {
    const { type } = questions[qIdx];
    const list = questions[qIdx].list;
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
            status={option ? "default" : "error"}
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
          <QuestionCard key={idx}>
            <QuestionCard.Header>
              <Container css={{ padding: 0 }}>
                <QuestionMetaInput
                  status={question.name ? "default" : "error"}
                  value={question.name}
                  placeholder="Question"
                  style={{ fontSize: "1rem", fontWeight: 600 }}
                  onChange={(name) => changePrimitive(idx, { name })}
                />
                {typeof question.description === "string" && (
                  <QuestionMetaInput
                    value={question.description}
                    style={{ fontSize: ".75rem" }}
                    placeholder="Question Description"
                    onChange={(description) =>
                      changePrimitive(idx, { description })
                    }
                  />
                )}
              </Container>
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
                onChange={(e) => changePrimitive(idx, { type: e as any })}
              />
            </QuestionCard.Header>
            <QuestionCard.Body>
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
            </QuestionCard.Body>
            <QuestionCard.Footer>
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
                <MiniIcon
                  content="Add/Remove Description"
                  onClick={() =>
                    changePrimitive(idx, {
                      description:
                        typeof question.description === "string" ? null : "",
                    })
                  }
                />
                <Spacer x={0.5} />
                <MiniIcon
                  color="primary"
                  icon="copy-outline"
                  content="Duplicate Question"
                  onClick={() => {}}
                />
                <Spacer x={0.5} />
                <ConfirmPop
                  colorScheme="error"
                  onConfirm={() => deleteQuestion(idx)}
                  content={
                    <MiniIcon
                      color="error"
                      icon="trash-outline"
                      content="Delete Question"
                    />
                  }
                />
              </div>
            </QuestionCard.Footer>
          </QuestionCard>
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
      <QuestionsEditorPanel
        isLoading={fetcher.state !== "idle"}
        onInsert={insertQuestion}
        onSubmit={submitChange}
      />
    </Container>
  );
}

function isNew(arg: boolean | undefined) {
  return typeof arg === "undefined";
}

function QuestionMetaInput({
  onChange,
  style,
  placeholder,
  value,
  status,
}: {
  onChange: (value: string) => void;
  placeholder?: string;
  value?: any;
  status?: "default" | "error";
  style?: React.CSSProperties;
}) {
  return (
    <Input
      fullWidth
      underlined
      status={status}
      animated={false}
      className="question-title-input"
      placeholder={placeholder}
      value={value}
      onChange={({ target }) => onChange(target.value)}
      style={style}
    />
  );
}

function MiniIcon({
  content,
  color,
  icon = "text-outline",
  onClick,
}: {
  icon?: string;
  content: string;
  onClick?: () => void;
  color?:
    | "default"
    | "text"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error";
}) {
  return (
    // @ts-ignore
    <Tooltip color={color || "default"} content={content}>
      <Link color={color || "text"} onClick={onClick}>
        {/* @ts-ignore */}
        <ion-icon
          name={icon}
          style={{ fontSize: "23px", marginRight: "6px" }}
        />
      </Link>
    </Tooltip>
  );
}
