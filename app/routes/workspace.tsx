import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import clsx from "clsx";
import { Outlet } from "@remix-run/react";
import { Container, useTheme } from "@nextui-org/react";

import ProfilePopover from "~/components/ProfilePopover";

import { useUser } from "~/libs";
import { requireUserId } from "~/session.server";

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

  const headerStyle = {
    bg: "$backgroundDeep",
    maxWidth: "100%",
    borderBottom: "1px solid $border",
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
            <ProfilePopover user={user} />
          </Container>
        </Container>
      </Container>
      <Outlet />
    </div>
  );
}
