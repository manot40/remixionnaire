import type { LoaderFunction } from "@remix-run/node";

import { Container, Text, User } from "@nextui-org/react";
import { Outlet } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/libs";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  return userId;
};

export default function DashboardLayout() {
  const user = useUser();

  const headerStyle = {
    bg: "$background",
    border: "1px solid $border",
    maxWidth: "100%",
  };

  return (
    <div>
      <Container fluid gap={0} css={headerStyle}>
        <Container
          sm
          alignItems="center"
          display="flex"
          wrap="nowrap"
          as="nav"
          css={{
            margin: "auto",
            padding: ".75rem 0 .75rem 0",
          }}
        >
          <Container display="flex" alignItems="center" css={{ flex: "1 1" }}>
            <Text h3 margin="0">
              Remixionnaire
            </Text>
          </Container>
          <Container display="flex" justify="flex-end" css={{ flex: "0 0" }}>
            <User
              // @ts-ignore
              pointer="true"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              size="sm"
              name={user.name}
              description="Creator"
              css={{
                flexDirection: "row-reverse",
                textAlign: "right",
                marginLeft: "0",
              }}
            />
          </Container>
        </Container>
        <Container sm alignItems="center" display="flex" wrap="nowrap">
          Test
        </Container>
      </Container>
      <Outlet />
    </div>
  );
}
