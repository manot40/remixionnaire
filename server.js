import { createRequestHandler as lambdaHandler } from "@remix-run/architect";
import { createRequestHandler as vercelHandler } from "@remix-run/vercel";

import * as build from "@remix-run/dev/server-build";

const createRequestHandler =
  process.env.REMIX_RUNTIME === "arc" ? lambdaHandler : vercelHandler;

export const handler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});
