import useDarkMode from "use-dark-mode";
import { Toaster } from "react-hot-toast";
import { createTheme, NextUIProvider } from "@nextui-org/react";

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

const Document = ({ children }: { children: JSX.Element }) => {
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
        {children}
        <Toaster toastOptions={{ className: "toasty" }} />
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
};

const sans = 'Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"';

const darkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {
      backgroundDeep: "#101010",
    },
    fonts: { sans },
    letterSpacings: {
      tighter: "-.049375rem",
    },
  },
});

const lightTheme = createTheme({
  type: "light",
  theme: {
    colors: {
      gray50: "#EFEFEF",
      backgroundDeep: "#FAFAFF",
      background: "#F9F9F9",
    },
    fonts: { sans },
    letterSpacings: {
      tighter: "-.049375rem",
    },
  },
});

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
