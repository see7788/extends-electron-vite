#!/usr/bin/env tsx

import { serve } from "@hono/node-server";
import createViteRouter from "extends-hono/create-reactapp-router";
import { Hono } from "hono";
import { fileURLToPath, pathToFileURL } from "node:url";
import { z } from "zod";
import chatRouter from "./chat";
import emailRouter from "./email";
import fileRouter from "./file";
import { ssePushRouter, sseRouter } from "./sse";
import store from "./store";
import tplRouter from "./tpl";
import globalTplRouter from "./tpl/global";
import hookReceive from "./sse/hookReceive";

const hookArgsSchema = z.object({
  command: z.literal("hook"),
  hostname: z.string().min(1),
  port: z.coerce.number().int().positive(),
  role: z.enum(["user", "assistant"]),
});

const entryPath = process.argv[1];
if (entryPath && pathToFileURL(entryPath).href === import.meta.url) {
  const hookArgs = hookArgsSchema.safeParse({
    command: process.argv[2],
    hostname: process.argv[3],
    port: process.argv[4],
    role: process.argv[5],
  });
  if (hookArgs.success) {
    let stdin = "";
    for await (const chunk of process.stdin) stdin += chunk;
    await hookReceive({ ...hookArgs.data, stdin });
  } else {
    const app = new Hono()
      .get("/favicon.ico", (ctx) => ctx.body(null, 204))
      .route("/", chatRouter)
      .route("/", tplRouter)
      .route("/", globalTplRouter)
      .route("/", sseRouter)
      .route("/", ssePushRouter)
      .route("/", emailRouter)
      .route("/", fileRouter)
      .route("/", await createViteRouter({
        root: fileURLToPath(new URL("../../reactapp", import.meta.url)),
      }));
    const { hostname, port } = store.getState().runtimeActions;
    const server = serve({ fetch: app.fetch, hostname, port }, (info) => {
      console.log(`http://${hostname}:${String(info.port)}`);
    });
    process.once("SIGINT", () => server.close());
    process.once("SIGTERM", () => server.close());
  }
}
