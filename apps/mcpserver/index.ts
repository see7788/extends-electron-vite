import { StreamableHTTPTransport } from "@hono/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Hono } from "hono";
import { hc } from "hono/client";
import { homedir } from "node:os";
import store from "honoapp/src/store";
import type tpl2Router from "honoapp/src/tpl2";
import { workspacePathSchema } from "honoapp/src/tpl2";

const app = new Hono();
const mcpServer = new McpServer({
  name: "extends-mcpserver",
  version: "0.0.0",
});
const transport = new StreamableHTTPTransport();

const outputMaterialize = async (workspacePath: string) => {
  const { hostname, port } = store.getState().runtimeActions;
  const client = hc<typeof tpl2Router>(`http://${hostname}:${String(port)}`);
  const response = await client.tpl2.output.materialize.$post({ json: { workspacePath } });
  const content = await response.text();
  if (!response.ok) throw new Error(content);
  return content;
};

mcpServer.registerTool(
  "tplGlobalMaterialize",
  {
    description: "物化全局 Codex 模板；只写入用户级 Codex 工作区。",
    inputSchema: {},
  },
  async () => {
    return { content: [{ type: "text", text: await outputMaterialize(homedir()) }] };
  },
);

mcpServer.registerTool(
  "tplProjectMaterialize",
  {
    description: "物化项目 Codex 模板；只写入指定项目工作区。",
    inputSchema: workspacePathSchema.shape,
  },
  async ({ workspacePath }) => {
    return { content: [{ type: "text", text: await outputMaterialize(workspacePath) }] };
  },
);

app.all("/mcp", async (context) => {
  if (!mcpServer.isConnected()) await mcpServer.connect(transport);
  return transport.handleRequest(context);
});

export default app;
