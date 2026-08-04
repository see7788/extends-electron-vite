import { Hono } from "hono";
import emailRouter from "./email";
import fileRouter from "./file";
import { ssePushRouter, sseRouter } from "./sse";
import tpl from "./tpl";

const router = new Hono()
  .get("/favicon.ico", (ctx) => ctx.body(null, 204))
  .route("/", tpl.hono)
  .route("/", sseRouter)
  .route("/", ssePushRouter)
  .route("/", emailRouter)
  .route("/", fileRouter)
export type Router = typeof router;

export default router;
