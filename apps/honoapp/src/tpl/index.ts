import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import store from "../store";
import { workspacePathSchema } from "./store";

export type { ProjectSource as Tpl } from "../tpl2/schema";

const sourceSchema = workspacePathSchema.extend({ source: z.string().min(1) });

const tplRouter = new Hono()
  .basePath("/tpl")
  .get("/", (ctx) => ctx.redirect("/#/tpl"))
  .get("/source", zValidator("query", workspacePathSchema), (ctx) => {
    const { hostname, port } = store.getState().runtimeActions;
    return ctx.json(store.getState().tplActions.sourceRead({
      hostname,
      port,
      workspacePath: ctx.req.valid("query").workspacePath,
    }));
  })
  .put("/source", zValidator("json", sourceSchema), (ctx) => {
    const { hostname, port } = store.getState().runtimeActions;
    store.getState().tplActions.sourceUpdate({ ...ctx.req.valid("json"), hostname, port });
    return ctx.json(null, 200);
  })
  .post("/materialize", zValidator("json", workspacePathSchema), (ctx) => {
    const { hostname, port } = store.getState().runtimeActions;
    store.getState().tplActions.outputMaterialize({
      hostname,
      port,
      workspacePath: ctx.req.valid("json").workspacePath,
    });
    return ctx.json(null, 200);
  })
  .get("/status", zValidator("query", workspacePathSchema), (ctx) => {
    const { hostname, port } = store.getState().runtimeActions;
    return ctx.json(store.getState().tplActions.sourceRead({
      hostname,
      port,
      workspacePath: ctx.req.valid("query").workspacePath,
    }));
  });

export default tplRouter;
