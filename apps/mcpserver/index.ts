import { StreamableHTTPTransport } from "@hono/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Hono } from "hono";
import store from "honoapp/src/store";
import { existsSync } from "node:fs";
import { z } from "zod";

const app = new Hono();
const mcpServer = new McpServer({
  name: "extends-mcpserver",
  version: "0.0.0",
});
const transport = new StreamableHTTPTransport();

mcpServer.registerTool(
  "tplGlobalMaterialize",
  {
    description: "物化全局 Codex 模板；只写入用户级 Codex 工作区。",
    inputSchema: {},
  },
  async () => {
    store.getState().globalTplActions.outputMaterialize();
    return { content: [{ type: "text", text: "全局模板物化成功。" }] };
  },
);

mcpServer.registerTool(
  "tplProjectMaterialize",
  {
    description: "物化项目 Codex 模板；只写入指定项目工作区。",
    inputSchema: {
      workspacePath: z.string().refine(existsSync, "workspacePath must exist"),
    },
  },
  async ({ workspacePath }) => {
    const { runtimeActions, tplActions } = store.getState();
    tplActions.outputMaterialize({ ...runtimeActions, workspacePath });
    return { content: [{ type: "text", text: "项目模板物化成功。" }] };
  },
);

app.all("/mcp", async (context) => {
  if (!mcpServer.isConnected()) await mcpServer.connect(transport);
  return transport.handleRequest(context);
});

export default app;
