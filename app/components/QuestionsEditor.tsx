import type { LoaderData as FormData } from "~/routes/workspace/$formId";

import {
  Container,
  Card,
  Spacer,
  Input,
  Textarea,
  Radio,
  Checkbox,
  Button,
} from "@nextui-org/react";

type TProps = {
  meta: FormData["meta"];
  questions: FormData["questions"];
};

export default function QuestionsEditor({ meta, questions }: TProps) {
  const questionContentRender = (question: FormData["questions"][number]) => {
    const { type } = question;
    const list = question.list as [];
    if (type === "SHORT_TEXT") {
      return <Input underlined placeholder="Short Text Answer Input" />;
    }
    if (type === "TEXT") {
      return <Textarea underlined placeholder="Text Answer Input" />;
    }
    if (type === "RADIO") {
      return list?.map((choice) => (
        <div
          key={choice}
          className="w-full"
          style={{ display: "flex", marginTop: "18px", alignItems: "center" }}
        >
          <Radio disabled value={choice} size="sm" />
          <Spacer x={0.25} />
          <Input underlined placeholder={choice} fullWidth />
          <Button color="error" light auto>
            {/* @ts-ignore */}
            <ion-icon name="close" style={{fontSize: "21px"}} />
          </Button>
        </div>
      ));
    }
    if (type === "CHECKBOX") {
      return list?.map((choice) => (
        <div
          key={choice}
          className="w-full"
          style={{ display: "flex", marginTop: "18px", alignItems: "center" }}
        >
          <Checkbox isDisabled size="sm" />
          <Spacer x={0.5} />
          <Input underlined placeholder={choice} fullWidth />
          <Button color="error" light auto>
            {/* @ts-ignore */}
            <ion-icon name="close" style={{fontSize: "21px"}} />
          </Button>
        </div>
      ));
    }
    return null;
  };
  return (
    <Container sm>
      {questions.map((question) => (
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
          {questionContentRender(question)}
        </Card>
      ))}
    </Container>
  );
}
