import { StreamableHTTPTransport } from "@hono/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { store } from "honoapp";
import { Hono } from "hono";
import { z } from "zod";

const materializeInputSchema = z.object({});

const mcpserverApp = () => {
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
      inputSchema: materializeInputSchema.shape,
    },
    async () => {
      store.getState().globalTplActions.outputMaterialize();
      return { content: [{ type: "text", text: "全局模板物化成功。" }] };
    },
  );

  mcpServer.registerTool(
    "tplProjectMaterialize",
    {
      description: "物化项目 Codex 模板；只写入当前启动服务所绑定的项目工作区。",
      inputSchema: materializeInputSchema.shape,
    },
    async () => {
      const { runtimeActions, tplActions } = store.getState();
      if (!runtimeActions) throw new Error("honoapp 服务尚未启动，无法物化项目模板");
      tplActions.outputMaterialize(runtimeActions);
      return { content: [{ type: "text", text: "项目模板物化成功。" }] };
    },
  );

  app.all("/mcp", async (context) => {
    if (!mcpServer.isConnected()) await mcpServer.connect(transport);
    return transport.handleRequest(context);
  });

  return app;
};

export default mcpserverApp;
