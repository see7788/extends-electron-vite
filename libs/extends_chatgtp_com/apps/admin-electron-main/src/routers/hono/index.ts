import { Hono } from "hono";
import { cors } from "hono/cors";
import honoHandler from "electron.vite.config/rendererHonoReactPlugin/honoHandler";
import adminPackage from "../../../package.json";
import adminWebApi from "./admin-web";
import userWebApi from "./user-web";

export default function routersRead() {
  return new Hono()
    .use("*", cors())
    .get("/health", (ctx) => ctx.json<{ ok: true; service: string }>({ ok: true, service: adminPackage.name }))
    .route("/", adminWebApi)
    .route("/", userWebApi)
    .all("/:name", honoHandler)
    .all("/:name/*", honoHandler);
}
