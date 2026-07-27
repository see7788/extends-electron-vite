import { Hono } from "hono";
import emailRouter from "./email";
import fileRouter from "./file";
import { ssePushRouter, sseRouter } from "./sse";
import {mcpServer} from "./store";
import tplRouter from "./tpl";
mcpServer.mcpRegister("codegraph").mcpRegister("browser")
export default new Hono()
  .get("/favicon.ico", (ctx) => ctx.body(null, 204))
  .all("/mcp", mcpServer.honoHandler)
  .route("/", tplRouter)
  .route("/", sseRouter)
  .route("/", ssePushRouter)
  .route("/", emailRouter)
  .route("/", fileRouter);
