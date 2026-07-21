#!/usr/bin/env tsx

import { serve } from "@hono/node-server";
import createViteRouter from "extends-hono/create-reactapp-router";
import { Hono } from "hono";
import { fileURLToPath} from "node:url";
import emailRouter from "./email";
import fileRouter from "./file";
import { ssePushRouter, sseRouter } from "./sse";
import store from "./store";
import tplRouter from "./tpl";
import tpl2Router from "./tpl2";
import globalTplRouter from "./tpl/global";
const app = new Hono()
  .get("/favicon.ico", (ctx) => ctx.body(null, 204))
  .route("/", tplRouter)
  .route("/", tpl2Router)
  .route("/", globalTplRouter)
  .route("/", sseRouter)
  .route("/", ssePushRouter)
  .route("/", emailRouter)
  .route("/", fileRouter)
  .all("/tpl2-mcp", async (ctx) => {
    const { server, transport } = store.getState().mcpActions.tpl2;
    if (!server.isConnected()) await server.connect(transport);
    return transport.handleRequest(ctx);
  })
  .route("/", await createViteRouter({
    root: fileURLToPath(new URL("../../reactapp", import.meta.url)),
  }));
const { hostname, port } = store.getState().runtimeActions;
const server = serve({ fetch: app.fetch, hostname, port }, (info) => {
  console.log(`http://${hostname}:${String(info.port)}`);
});
process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
