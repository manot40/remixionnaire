import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import {
  Button,
  Card,
  Container,
  Divider,
  Popover,
  User,
  useTheme,
} from "@nextui-org/react";
import { Form, Outlet } from "@remix-run/react";
import useDarkMode from "use-dark-mode";
import { useRef } from "react";
import clsx from "clsx";

import { requireUserId } from "~/session.server";
import { useUser } from "~/libs";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  return userId;
};

export const meta: MetaFunction = () => {
  return {
    title: "Remixionnaire | Workspace",
  };
};

export default function WorkspaceLayout() {
  const user = useUser();

  const { isDark } = useTheme();
  const { toggle } = useDarkMode(false);

  const headerStyle = {
    bg: "$backgroundDeep",
    maxWidth: "100%",
    borderBottom: "1px solid $border",
  };

  const userImageStyle = {
    flexDirection: "row-reverse",
    textAlign: "right",
    marginLeft: "0",
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
              className={clsx("logo", { invert: isDark })}
              src="/images/R.png"
              alt="branding"
              width={32}
              height={32}
            />
          </Container>
          <Container display="flex" justify="flex-end" css={{ flex: "0 0" }}>
            <Popover>
              <Popover.Trigger>
                <User
                  // @ts-ignore
                  pointer="true"
                  src="https://i.pravatar.cc/150?img=15"
                  size="sm"
                  name={user.name}
                  description="Creator"
                  css={userImageStyle}
                />
              </Popover.Trigger>
              <Popover.Content>
                <Card
                  css={{
                    background: "$background",
                    border: "1px solid $border",
                  }}
                >
                  <div>
                    <Button
                      icon={
                        //@ts-ignore
                        <ion-icon
                          name="person-outline"
                          style={{ fontSize: "18px" }}
                        />
                      }
                      light
                    >
                      Profile
                    </Button>
                    <Button
                      icon={
                        //@ts-ignore
                        <ion-icon
                          name={isDark ? "moon-outline" : "sunny-outline"}
                          style={{ fontSize: "18px" }}
                        />
                      }
                      light
                      onClick={toggle}
                      style={{ marginBottom: ".5rem" }}
                    >
                      {isDark ? "Dark" : "Light"} Theme
                    </Button>
                    <Divider />
                    <Form action="/logout" method="post">
                      <Button
                        icon={
                          //@ts-ignore
                          <ion-icon
                            name="log-out-outline"
                            style={{ fontSize: "18px" }}
                          />
                        }
                        flat
                        type="submit"
                        color="error"
                        style={{ marginTop: ".5rem" }}
                      >
                        Logout
                      </Button>
                    </Form>
                  </div>
                </Card>
              </Popover.Content>
            </Popover>
          </Container>
        </Container>
      </Container>
      <Outlet />
    </div>
  );
}
