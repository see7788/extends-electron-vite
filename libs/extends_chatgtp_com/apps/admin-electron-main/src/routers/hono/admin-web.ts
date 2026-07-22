import createViteRouter from "extends-hono/create-reactapp-router/index.ts";
import { Hono } from "hono";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import chatgptBrowserAdminWebIpc from "../../chatgptBrowser/admin-web-ipc";
import connectionAdminWebIpc from "../../connection/admin-web-ipc";
import topicAdminWebIpc from "../../topic/admin-web-ipc";

const adminWebName = "admin-web";
const adminWebBasePath = `/${adminWebName}`;
const appsDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

const adminWebApi = new Hono()
  .route("/", chatgptBrowserAdminWebIpc)
  .route("/", topicAdminWebIpc)
  .route("/", connectionAdminWebIpc);

export type AdminWebApi = typeof adminWebApi;

export default async function adminWebHonoRead() {
  const adminViteRouter = await createViteRouter({
    root: join(appsDir, adminWebName),
    basePath: adminWebBasePath,
  });

  return new Hono()
    .route("/", adminWebApi)
    .all(adminWebBasePath, (ctx) => adminViteRouter.fetch(ctx.req.raw, ctx.env))
    .all(`${adminWebBasePath}/*`, (ctx) => adminViteRouter.fetch(ctx.req.raw, ctx.env));
}
