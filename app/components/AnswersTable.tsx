import type { Respondent } from "@prisma/client";
import type { WorkspaceData } from "~/types";

import {
  Container,
  Spacer,
  Text,
  Table,
  Button,
  Card,
} from "@nextui-org/react";

type IProps = {
  questions: WorkspaceData["questions"];
  respondents: Respondent[];
};

export default function AnswersTable({ questions, respondents }: IProps) {
  const tableData = respondents.map((r) => {
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      answers: questions.map((q) => {
        const rand = window.crypto.randomUUID();
        const _ = q.answers?.find(
          (a) => a.respondentId === r.id && a.questionId === q.id
        );
        return {
          id: _?.id || rand,
          data: parseAnswer(_?.answer),
        };
      }),
    };
  });

  function parseAnswer(answer?: string): string | JSX.Element {
    if (!answer) return "";
    return /^\[/i.test(answer) ? JSON.parse(answer).join(", ") : answer;
  }

  return (
    <Container lg>
      <Spacer y={1.5} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Text h1 className="heading-text">
          Recorded Answers
        </Text>
        <Button
          disabled={tableData.length < 1}
          css={{ alignSelf: "center", backgroundColor: "#0e5c2f" }}
          auto
        >
          Export to xlsx
        </Button>
      </div>
      <Spacer />
      {tableData.length ? (
        <Table
          selectionMode="multiple"
          striped
          css={{
            height: "auto",
            minWidth: "100%",
            backgroundColor: "$background",
          }}
        >
          <Table.Header>
            <Table.Column key="name">Respondent</Table.Column>
            {questions.map((q) => (
              <Table.Column key={q.id}>{q.name}</Table.Column>
            ))}
          </Table.Header>
          <Table.Body>
            {tableData.map((data) => (
              <Table.Row key={data.id}>
                <Table.Cell>
                  <div className="inline-name-wrapper">
                    <Text b>{data.name}</Text>
                    <Text size={12} css={{ color: "$gray600" }}>
                      {data.email}
                    </Text>
                  </div>
                </Table.Cell>
                {data.answers.map((a) => (
                  <Table.Cell key={a.id}>
                    {a.data ? (
                      a.data
                    ) : (
                      <Text small i>
                        (no answer)
                      </Text>
                    )}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Card
          css={{
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text css={{ color: "$accents6", letterSpacing: "$normal" }}>
            No answers yet
          </Text>
        </Card>
      )}
      <Spacer y={2.5} />
    </Container>
  );
}
