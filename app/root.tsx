import type {
  LoaderFunction,
  MetaFunction,
  LinksFunction,
} from "@remix-run/node";

import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import useDarkMode from "use-dark-mode";
import { darkTheme, lightTheme } from "./themes";
import { NextUIProvider } from "@nextui-org/react";

import style from "./assets/global.css";
import { getUser } from "./session.server";
import { Toaster } from "react-hot-toast";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: style }];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remixionnaire",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  isLambda: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
    isLambda: process.env.REMIX_RUNTIME === "arc",
  });
};

export default function App() {
  const { value: isDark } = useDarkMode(false);
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider theme={isDark ? darkTheme : lightTheme}>
          <Outlet />
        </NextUIProvider>
        <Toaster toastOptions={{ className: "toasty" }} />
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
        <script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
        />
      </body>
    </html>
  );
}
