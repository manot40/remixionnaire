import type { Answer, Question, Respondent } from "@prisma/client";

import {
  Container,
  Spacer,
  Text,
  Table,
  Button,
  Card,
} from "@nextui-org/react";
import { objArrSort } from "~/libs";

interface IProps {
  questions: Question[];
  respondents: Respondent[];
  answers: Answer[];
}

export default function AnswersTable({
  questions,
  respondents,
  answers,
}: IProps) {
  const answersOf = (id: string) =>
    objArrSort(
      answers.filter((answer) => answer.respondentId === id),
      "id"
    );
  const tableData = respondents.map((r) => {
    const answers = answersOf(r.id);
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      answers: answers.map((a) => {
        return { id: a.id, data: a.answer };
      }),
    };
  });
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
          aria-label="Example static collection table with multiple selection"
          selectionMode="multiple"
          striped
          css={{
            height: "auto",
            minWidth: "100%",
            backgroundColor: "$background",
          }}
        >
          <Table.Header>
            <Table.Column key="name">
              Respondent
            </Table.Column>
            {questions.map((q) => (
              <Table.Column key={`col-${q.id}`}>
                {q.name}
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body>
            {tableData.map((data) => (
              <Table.Row key={`row-${data.id}`}>
                <Table.Cell key={`cell-${data.id}`}>
                  <div className="inline-name-wrapper">
                    <Text b>{data.name}</Text>
                    <Text size={12} css={{ color: "$gray600" }}>
                      {data.email}
                    </Text>
                  </div>
                </Table.Cell>
                {data.answers.map((a) => (
                  <Table.Cell key={`cell-${a.id}`}>{a.data}</Table.Cell>
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
          <Text css={{color: "$accents6", letterSpacing: "$normal"}}>No answers yet</Text>
        </Card>
      )}
      <Spacer y={2.5} />
    </Container>
  );
}
