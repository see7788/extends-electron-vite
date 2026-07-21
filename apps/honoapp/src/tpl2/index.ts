import { existsSync, statSync } from "node:fs";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import store from "../store";

const workspacePathSchema = z.object({
  workspacePath: z.string().min(1).refine(workspacePath => existsSync(workspacePath) && statSync(workspacePath).isDirectory(), "workspacePath must be an existing directory"),
});

const sourceInputSchema = workspacePathSchema.extend({
  source: z.string().min(1),
});

const tpl2Router = new Hono()
  .basePath("/tpl2")
  .get("/source", zValidator("query", workspacePathSchema), (ctx) => ctx.json(
    store.getState().tpl2Actions.sourceRead(ctx.req.valid("query").workspacePath),
  ))
  .put("/source", zValidator("json", sourceInputSchema), (ctx) => {
    const { source, workspacePath } = ctx.req.valid("json");
    store.getState().tpl2Actions.sourceUpdate(workspacePath, source);
    return ctx.json(null, 200);
  })
  .post("/output/filesStatus", zValidator("json", workspacePathSchema), (ctx) => ctx.json(
    store.getState().tpl2Actions.outputFilesStatus(ctx.req.valid("json").workspacePath),
  ))
  .post("/output/materialize", zValidator("json", workspacePathSchema), (ctx) => {
    store.getState().tpl2Actions.outputMaterialize(ctx.req.valid("json").workspacePath);
    return ctx.json(null, 200);
  })
  .post("/output/rebase", zValidator("json", workspacePathSchema), (ctx) => {
    store.getState().tpl2Actions.outputRebase(ctx.req.valid("json").workspacePath);
    return ctx.json(null, 200);
  });

export default tpl2Router;
