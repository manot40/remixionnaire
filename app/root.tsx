import { NextUIProvider, globalCss } from "@nextui-org/react";
import { json } from "@remix-run/node";
import { getUser } from "./session.server";

import style from "./assets/global.css";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

export function links() {
  return [{ rel: "stylesheet", href: style }];
}

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
  globalCss({
    html: { backgroundColor: "$accents0 !important" },
    body: { backgroundColor: "$accents0 !important" },
  })();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider>
          <Outlet />
        </NextUIProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
