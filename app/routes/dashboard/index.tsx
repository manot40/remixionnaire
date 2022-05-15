import type { LoaderFunction } from "@remix-run/node";

import { Card, Container, Grid, Row, Text } from "@nextui-org/react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { getQuestionnaires } from "~/models/questionnaire.server";
import { getUserId } from "~/session.server";

type LoaderData = {
  qreList: Awaited<ReturnType<typeof getQuestionnaires>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = (await getUserId(request)) || "";
  const qreList = await getQuestionnaires({ userId });
  return json<LoaderData>({ qreList });
};

export default function DashboardIndex() {
  const data = useLoaderData() as LoaderData;
  return (
    <Container sm>
      <Text h1>Dashboard</Text>
      <Grid.Container gap={2} justify="flex-start">
        {data.qreList.map((qre) => (
          <Grid xs={6} sm={3} key={qre.id}>
            <Card hoverable clickable>
              <Card.Body css={{ p: 0 }}>
                <Card.Image
                  objectFit="cover"
                  src="https://nextui.org/images/fruit-6.jpeg"
                  width="100%"
                  height={140}
                  alt={qre.name}
                />
              </Card.Body>
              {/* @ts-ignore */}
              <Card.Footer justify="flex-start">
                <Row wrap="wrap" justify="space-between">
                  <Text b>{qre.name}</Text>
                  <Text css={{ color: "$accents4", fontWeight: "$semibold" }}>
                    {qre.status}
                  </Text>
                </Row>
              </Card.Footer>
            </Card>
          </Grid>
        ))}
      </Grid.Container>
    </Container>
  );
}
