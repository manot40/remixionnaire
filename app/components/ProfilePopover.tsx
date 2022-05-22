import type { User as TUser } from "@prisma/client";

import {
  Button,
  Card,
  Divider,
  Popover,
  Spacer,
  useTheme,
} from "@nextui-org/react";
import Profile from "./Profile";
import useDarkMode from "use-dark-mode";
import { Form, useLocation, useNavigate } from "@remix-run/react";

export default function ProfilePopover({ user }: { user?: TUser }) {
  const { isDark } = useTheme();
  const { toggle } = useDarkMode(false);

  const navigation = useNavigate();
  const { pathname } = useLocation();

  return (
    <Popover>
      <Popover.Trigger>
        <div>
          <Profile user={user} />
        </div>
      </Popover.Trigger>
      <Popover.Content>
        <Card
          css={{
            background: "$background",
            border: "1px solid $border",
          }}
        >
          <div>
            {user && (
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
            )}
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
            <Spacer y={pathname !== "/" ? 0.25 : 0.5} />
            {user ? (
              <Form action="/logout" method="post">
                <Button
                  ghost
                  icon={
                    //@ts-ignore
                    <ion-icon
                      name="browsers-outline"
                      style={{ fontSize: "17px" }}
                    />
                  }
                  style={{ display: pathname !== "/" ? "none" : "" }}
                  onClick={() => navigation("/workspace")}
                >
                  Workspace
                </Button>
                <Spacer y={pathname !== "/" ? 0 : 0.1} />
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
            ) : (
              <Button
                icon={
                  //@ts-ignore
                  <ion-icon
                    name="log-in-outline"
                    style={{ fontSize: "18px" }}
                  />
                }
                flat
                onClick={() => navigation("/login")}
              >
                Login
              </Button>
            )}
          </div>
        </Card>
      </Popover.Content>
    </Popover>
  );
}
