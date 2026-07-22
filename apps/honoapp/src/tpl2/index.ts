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

export { sourceInputSchema, workspacePathSchema };

const tpl2Router = new Hono()
  .get("/tpl2/source", zValidator("query", workspacePathSchema), (ctx) => ctx.json(
    store.getState().tpl2Actions.sourceRead(ctx.req.valid("query").workspacePath),
  ))
  .put("/tpl2/source", zValidator("json", sourceInputSchema), (ctx) => {
    const { source, workspacePath } = ctx.req.valid("json");
    store.getState().tpl2Actions.sourceUpdate(workspacePath, source);
    return ctx.body(null, 204);
  })
  .post("/tpl2/output/filesStatus", zValidator("json", workspacePathSchema), (ctx) => ctx.json(
    store.getState().tpl2Actions.outputFilesStatus(ctx.req.valid("json").workspacePath),
  ))
  .post("/tpl2/output/materialize", zValidator("json", workspacePathSchema), (ctx) => {
    store.getState().tpl2Actions.outputMaterialize(ctx.req.valid("json").workspacePath);
    return ctx.body(null, 204);
  })
  .post("/tpl2/output/rebase", zValidator("json", workspacePathSchema), (ctx) => {
    store.getState().tpl2Actions.outputRebase(ctx.req.valid("json").workspacePath);
    return ctx.body(null, 204);
  })
  .all("/tpl2-mcp", async (ctx) => {
    const { server, transport } = store.getState().tpl2Actions;
    if (!server.isConnected()) await server.connect(transport);
    return transport.handleRequest(ctx);
  });

const { responseContentRead, server } = store.getState().tpl2Actions;

server.registerTool("tpl2.source.GET", {
  title: "读取 Codex 模板源码",
  description: "读取指定工作区当前使用的 Codex 模板 TypeScript 源码；在检查或准备编辑模板时使用；需要现存工作区的绝对路径；返回完整模板源码；不会修改持久化数据或工作区文件。",
  inputSchema: workspacePathSchema.shape,
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
}, async ({ workspacePath }) => responseContentRead(await tpl2Router.request(
  `/tpl2/source?${new URLSearchParams({ workspacePath })}`,
)));
server.registerTool("tpl2.source.PUT", {
  title: "更新 Codex 模板源码",
  description: "验证并保存指定工作区的 Codex 模板 TypeScript 源码；在已经取得完整新源码并需要替换当前模板时使用；需要现存工作区绝对路径和完整源码；成功后返回 HTTP 状态码 204；会覆盖该工作区已保存的模板源码，但不会立即物化文件。",
  inputSchema: sourceInputSchema.shape,
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
}, async (json) => responseContentRead(await tpl2Router.request("/tpl2/source", {
  method: "PUT",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(json),
})));
server.registerTool("tpl2.output.filesStatus.POST", {
  title: "检查 Codex 模板物化状态",
  description: "检查指定工作区的 Codex 模板输出文件是否存在以及是否偏离当前模板；在决定是否物化前使用；需要现存工作区的绝对路径；返回现存文件和内容不一致文件的路径集合；不会修改任何文件。",
  inputSchema: workspacePathSchema.shape,
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
}, async (json) => responseContentRead(await tpl2Router.request("/tpl2/output/filesStatus", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(json),
})));
server.registerTool("tpl2.output.materialize.POST", {
  title: "物化 Codex 模板",
  description: "把指定工作区当前保存的 Codex 模板写入该工作区的 .codex 配置及受管文件；在模板已经确认并需要实际生效时使用；需要现存工作区的绝对路径；成功后返回 HTTP 状态码 204；会创建或更新受管文件。",
  inputSchema: workspacePathSchema.shape,
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
}, async (json) => responseContentRead(await tpl2Router.request("/tpl2/output/materialize", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(json),
})));
server.registerTool("tpl2.output.rebase.POST", {
  title: "重建 Codex 模板物化基线",
  description: "在安全检查通过后，把指定工作区当前受管文件记录为新的 Codex 模板物化基线；仅在确认现有受管文件应成为后续比较基准时使用；需要现存工作区的绝对路径；成功后返回 HTTP 状态码 204；会更新物化状态记录。",
  inputSchema: workspacePathSchema.shape,
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
}, async (json) => responseContentRead(await tpl2Router.request("/tpl2/output/rebase", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(json),
})));

export default tpl2Router;
