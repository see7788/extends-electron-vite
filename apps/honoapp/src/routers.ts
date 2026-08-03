import { Hono } from "hono";
import Mcp from "mcp-server/index.ts";
import todocli from "mcpcreate-lib/index.ts";
import pkg from "../package.json";
import nodeServiceRouter from "windows-named-pipe/index.tsx";
import emailRouter from "./email";
import fileRouter from "./file";
import { ssePushRouter, sseRouter } from "./sse";
import tpl from "./tpl";

const mcp = new Mcp({ name: pkg.name, version: pkg.version })
  .register("create-todo-cli", todocli)
  .register("honoapp", tpl);

const router = new Hono()
  .get("/favicon.ico", (ctx) => ctx.body(null, 204))
  .route("/", mcp.hono)
  .route("/", sseRouter)
  .route("/", ssePushRouter)
  .route("/", emailRouter)
  .route("/", fileRouter)
  .route("/", nodeServiceRouter);

export type Router = typeof router;

export default router;
