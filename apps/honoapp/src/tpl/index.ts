import { existsSync, statSync } from "node:fs";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import Register from "mcp-server-lib/public.ts";
import { z } from "zod";
import store from "../store";
import pkg from "../../package.json"
const workspacePathSchema = z.object({
  workspacePath: z.string().min(1).refine(
    workspacePath => existsSync(workspacePath) && statSync(workspacePath).isDirectory(),
    "workspacePath must be an existing directory",
  ),
});
const sourceSchema = workspacePathSchema.extend({
  source: z.string().min(1),
});

const mcp = new Register({ namespace:pkg.name }).register(
  "/tpl/source",
  new Hono().onError((error, context) => context.text(error.message, 500)).get("/", zValidator("query", workspacePathSchema), (context) => {
    return context.json(store.getState().tplActions.sourceRead(context.req.valid("query").workspacePath));
  }),
  workspacePathSchema,
  "读取指定工作区当前使用的 Codex 模板 TypeScript 源码；在检查或准备编辑模板时使用；需要现存工作区的绝对路径；返回完整模板源码；不会修改持久化数据或工作区文件。",
  { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
).register(
  "/tpl/source",
  new Hono().onError((error, context) => context.text(error.message, 500)).put("/", zValidator("json", sourceSchema), (context) => {
    const { source, workspacePath } = context.req.valid("json");
    store.getState().tplActions.sourceUpdate(workspacePath, source);
    return context.body(null, 204);
  }),
  sourceSchema,
  "静态验证并保存指定工作区的 Codex 模板 TypeScript 源码，同时登记该工作区允许物化；在已经取得完整新源码并需要替换当前模板时使用；需要现存工作区绝对路径和完整源码；成功后不返回内容；不会执行源码表达式，也不会立即物化文件。",
  { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
).register(
  "/tpl/output/filesStatus",
  new Hono().onError((error, context) => context.text(error.message, 500)).post("/", zValidator("json", workspacePathSchema), (context) => {
    return context.json(store.getState().tplActions.outputFilesStatus(context.req.valid("json").workspacePath));
  }),
  workspacePathSchema,
  "检查指定工作区的 Codex 模板输出并生成物化计划；必须在物化前使用；需要现存工作区的绝对路径；保留返回 existing、dirty，并补充新增、更新、删除、未变化、阻塞和计划 revision；不会修改任何文件。",
  { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
).register(
  "/tpl/output/materialize",
  new Hono().onError((error, context) => context.text(error.message, 500)).post("/", zValidator("json", workspacePathSchema), (context) => {
    store.getState().tplActions.outputMaterialize(context.req.valid("json").workspacePath);
    return context.body(null, 204);
  }),
  workspacePathSchema,
  "按最近一次无阻塞且未过期的输出计划，把指定工作区当前保存的 Codex 模板原子写入 .codex 受管文件；调用前必须依次完成 source.PUT 和 output.filesStatus.POST；需要现存工作区的绝对路径；成功后不返回内容；会创建、更新或删除受管文件并在失败时回滚。",
  { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
);

export default mcp;
