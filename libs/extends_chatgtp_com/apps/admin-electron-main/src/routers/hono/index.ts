import { Hono } from "hono";
import { cors } from "hono/cors";
import adminPackage from "../../../package.json";
import adminWebHonoRead from "./admin-web";
import userWebHonoRead from "./user-web";

export default async function routersRead() {
  const adminWebHono = await adminWebHonoRead();
  const userWebHono = await userWebHonoRead();

  return new Hono()
    .use("*", cors())
    .get("/health", (ctx) => ctx.json<{ ok: true; service: string }>({ ok: true, service: adminPackage.name }))
    .route("/", adminWebHono)
    .route("/", userWebHono);
}
