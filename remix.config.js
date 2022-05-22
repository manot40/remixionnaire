/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverBuildTarget: process.env.REMIX_RUNTIME || "vercel",
  // When running locally in development mode, we use the built in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  ignoredRouteFiles: ["**/.*"],
  assetsBuildDirectory: "public/build",
  publicPath:
    process.env.REMIX_RUNTIME === "arc" ? "/_static/build/" : "/build/",
  // appDirectory: "app",
  // serverBuildPath: "api/index.js",
};
