import { Toaster } from "react-hot-toast";
import { NextUIProvider, globalCss } from "@nextui-org/react";

import style from "./assets/global.css";
import { getUser } from "./session.server";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type {
  LoaderFunction,
  MetaFunction,
  LinksFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";

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
  globalCss({
    html: { backgroundColor: "$accents0 !important" },
    body: { backgroundColor: "$accents0 !important" },
  })();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <Scripts />
        <script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
        />
      </head>
      <body>
        <Toaster />
        <NextUIProvider>
          <Outlet />
        </NextUIProvider>
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}
