import type {
  LoaderFunction,
  MetaFunction,
  LinksFunction,
} from "@remix-run/node";

import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import useDarkMode from "use-dark-mode";
import { darkTheme, lightTheme } from "./themes";
import { NextUIProvider } from "@nextui-org/react";

import Document from "./document";
import style from "./assets/global.css";
import { getUser } from "./session.server";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: style }];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remixionnaire",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

export default function App() {
  const { value: isDark } = useDarkMode(false);
  return (
    <Document>
      <NextUIProvider theme={isDark ? darkTheme : lightTheme}>
        <Outlet />
      </NextUIProvider>
    </Document>
  );
}
