import { existsSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import store, { mcpServer as mcp } from "../store";

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
  });

mcp.requestToolRegister({
  name: "tpl.source.GET",
  title: "读取 Codex 模板源码",
  description: "读取指定工作区当前使用的 Codex 模板 TypeScript 源码；在检查或准备编辑模板时使用；需要现存工作区的绝对路径；返回完整模板源码；不会修改持久化数据或工作区文件。",
  inputSchema: workspacePathSchema,
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  request: ({ workspacePath }) => tplRouter.request(
    `/tpl/source?${new URLSearchParams({ workspacePath })}`,
  ),
});
mcp.requestToolRegister({
  name: "tpl.source.PUT",
  title: "更新 Codex 模板源码",
  description: "验证并保存指定工作区的 Codex 模板 TypeScript 源码；在已经取得完整新源码并需要替换当前模板时使用；需要现存工作区绝对路径和完整源码；成功后不返回内容；会覆盖该工作区已保存的模板源码，但不会立即物化文件。",
  inputSchema: sourceSchema,
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  request: (json) => tplRouter.request("/tpl/source", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(json),
  }),
});
mcp.requestToolRegister({
  name: "tpl.output.filesStatus.POST",
  title: "检查 Codex 模板物化状态",
  description: "检查指定工作区的 Codex 模板输出文件是否存在以及是否偏离当前模板；在决定是否物化前使用；需要现存工作区的绝对路径；返回现存文件和内容不一致文件的路径集合；不会修改任何文件。",
  inputSchema: workspacePathSchema,
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  request: (json) => tplRouter.request("/tpl/output/filesStatus", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(json),
  }),
});
mcp.requestToolRegister({
  name: "tpl.output.materialize.POST",
  title: "物化 Codex 模板",
  description: "把指定工作区当前保存的 Codex 模板写入该工作区的 .codex 配置及受管文件；在模板已经确认并需要实际生效时使用；需要现存工作区的绝对路径；成功后不返回内容；会创建或更新受管文件。",
  inputSchema: workspacePathSchema,
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  request: (json) => tplRouter.request("/tpl/output/materialize", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(json),
  }),
});

export default tplRouter;
