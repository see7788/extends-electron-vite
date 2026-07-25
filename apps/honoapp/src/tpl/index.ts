import { existsSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import store from "../store";

const workspacePathSchema = z.object({
  workspacePath: z.string().min(1).refine(
    workspacePath => existsSync(workspacePath) && statSync(workspacePath).isDirectory(),
    "workspacePath must be an existing directory",
  ),
});
const sourceSchema = workspacePathSchema.extend({
  source: z.string().min(1),
});

const tplRouter = new Hono()
  .basePath("/tpl")
  .get("/", context => context.redirect(`/#/tpl?${new URLSearchParams({ workspacePath: homedir() })}`))
  .get("/source", zValidator("query", workspacePathSchema), (context) => {
    const { workspacePath } = context.req.valid("query");
    return context.json(store.getState().tplActions.sourceRead(workspacePath));
  })
  .put("/source", zValidator("json", sourceSchema), (context) => {
    const { source, workspacePath } = context.req.valid("json");
    store.getState().tplActions.sourceUpdate(workspacePath, source);
    return context.body(null, 204);
  })
  .post("/output/filesStatus", zValidator("json", workspacePathSchema), (context) => {
    const { workspacePath } = context.req.valid("json");
    return context.json(store.getState().tplActions.outputFilesStatus(workspacePath));
  })
  .post("/output/materialize", zValidator("json", workspacePathSchema), (context) => {
    const { workspacePath } = context.req.valid("json");
    store.getState().tplActions.outputMaterialize(workspacePath);
    return context.body(null, 204);
  })
  .post("/output/rebase", zValidator("json", workspacePathSchema), (context) => {
    const { workspacePath } = context.req.valid("json");
    store.getState().tplActions.outputRebase(workspacePath);
    return context.body(null, 204);
  });

export default tplRouter;
