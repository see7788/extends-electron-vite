import { existsSync, statSync } from "node:fs";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import Register from "mcp-server/public.ts";
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

const mcp = new Register().register(
  "/tpl/source",
  new Hono().get("/", zValidator("query", workspacePathSchema), (context) => {
    return context.json(store.getState().tplActions.sourceRead(context.req.valid("query").workspacePath));
  }),
  workspacePathSchema,
  "读取指定工作区当前使用的 Codex 模板 TypeScript 源码；在检查或准备编辑模板时使用；需要现存工作区的绝对路径；返回完整模板源码；不会修改持久化数据或工作区文件。",
  { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
).register(
  "/tpl/source",
  new Hono().put("/", zValidator("json", sourceSchema), (context) => {
    const { source, workspacePath } = context.req.valid("json");
    store.getState().tplActions.sourceUpdate(workspacePath, source);
    return context.body(null, 204);
  }),
  sourceSchema,
  "验证并保存指定工作区的 Codex 模板 TypeScript 源码；在已经取得完整新源码并需要替换当前模板时使用；需要现存工作区绝对路径和完整源码；成功后不返回内容；会覆盖该工作区已保存的模板源码，但不会立即物化文件。",
  { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
).register(
  "/tpl/output/filesStatus",
  new Hono().post("/", zValidator("json", workspacePathSchema), (context) => {
    return context.json(store.getState().tplActions.outputFilesStatus(context.req.valid("json").workspacePath));
  }),
  workspacePathSchema,
  "检查指定工作区的 Codex 模板输出文件是否存在以及是否偏离当前模板；在决定是否物化前使用；需要现存工作区的绝对路径；返回现存文件和内容不一致文件的路径集合；不会修改任何文件。",
  { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
).register(
  "/tpl/output/materialize",
  new Hono().post("/", zValidator("json", workspacePathSchema), (context) => {
    store.getState().tplActions.outputMaterialize(context.req.valid("json").workspacePath);
    return context.body(null, 204);
  }),
  workspacePathSchema,
  "把指定工作区当前保存的 Codex 模板写入该工作区的 .codex 配置及受管文件；在模板已经确认并需要实际生效时使用；需要现存工作区的绝对路径；成功后不返回内容；会创建或更新受管文件。",
  { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
);

export default mcp;
