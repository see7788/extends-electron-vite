import createViteRouter from "extends-hono/create-reactapp-router/index.ts";
import { Hono } from "hono";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import connectionUserWebIpc from "../../connection/user-web-ipc";
import topicUserWebIpc from "../../topic/user-web-ipc";

const userWebName = "user-web";
const userWebBasePath = `/${userWebName}`;
const appsDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

const userWebApi = new Hono()
  .route("/", topicUserWebIpc)
  .route("/", connectionUserWebIpc);

export type UserWebApi = typeof userWebApi;

export default async function userWebHonoRead() {
  const userViteRouter = await createViteRouter({
    root: join(appsDir, userWebName),
    basePath: userWebBasePath,
  });

  return new Hono()
    .route("/", userWebApi)
    .all(userWebBasePath, (ctx) => userViteRouter.fetch(ctx.req.raw, ctx.env))
    .all(`${userWebBasePath}/*`, (ctx) => userViteRouter.fetch(ctx.req.raw, ctx.env));
}
