const isDev = process.env.NODE_ENV === "development";
const isVercel = process.env.VERCEL === 1;

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverBuildTarget: isVercel ? "vercel" : "node-cjs",
  server: !isDev && isVercel ? "./server.js" : undefined,
  ignoredRouteFiles: ["**/.*"],
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
};
