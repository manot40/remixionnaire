import { Toaster } from "react-hot-toast";
import { CssBaseline } from "@nextui-org/react";

import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export default function Document({ children }: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        {CssBaseline.flush()}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
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
