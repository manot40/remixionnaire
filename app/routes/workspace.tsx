import type { LoaderFunction } from "@remix-run/node";

import { Container, User } from "@nextui-org/react";
import { Form, Outlet } from "@remix-run/react";
import { useRef } from "react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/libs";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  return userId;
};

export default function WorkspaceLayout() {
  const formRef = useRef<HTMLFormElement>(null);
  const user = useUser();

  const headerStyle = {
    bg: "$background",
    maxWidth: "100%",
    border: "1px solid $border",
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
          <Container display="flex">
            <img
              src="/images/R.png"
              className="logo"
              alt="branding"
              width={32}
              height={32}
            />
          </Container>
          <Container display="flex" justify="flex-end" css={{ flex: "0 0" }}>
            <Form action="/logout" ref={formRef} method="post">
              <User
                // @ts-ignore
                pointer="true"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
                name={user.name}
                description="Creator"
                onClick={() => formRef.current?.submit()}
                css={{
                  flexDirection: "row-reverse",
                  textAlign: "right",
                  marginLeft: "0",
                }}
              />
            </Form>
          </Container>
        </Container>
      </Container>
      <Outlet />
    </div>
  );
}
