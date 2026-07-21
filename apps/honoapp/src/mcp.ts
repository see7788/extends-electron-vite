import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { hc } from "hono/client";
import emailRouter, { emailCollectSchema } from "./email";
import fileRouter, { fileQuerySchema } from "./file";
import { ssePushRouter, ssePushSchema } from "./sse";
import store from "./store";
import tplRouter, { tplSourceSchema } from "./tpl";
import globalTplRouter, { globalTplSourceSchema } from "./tpl/global";
import tpl2Router, { sourceInputSchema, workspacePathSchema } from "./tpl2";
import { workspacePathSchema as legacyWorkspacePathSchema } from "./tpl/store";

export default function mcpRegister(mcpServer: McpServer): void {
  const { hostname, port } = store.getState().runtimeActions;
  const origin = `http://${hostname}:${String(port)}`;
  const emailClient = hc<typeof emailRouter>(origin);
  const fileClient = hc<typeof fileRouter>(origin);
  const ssePushClient = hc<typeof ssePushRouter>(origin);
  const tplClient = hc<typeof tplRouter>(origin);
  const globalTplClient = hc<typeof globalTplRouter>(origin);
  const tpl2Client = hc<typeof tpl2Router>(origin);
  const responseResult = async (response: Response) => {
    const text = await response.text();
    if (!response.ok) throw new Error(text);
    return { content: [{ type: "text" as const, text }] };
  };

  mcpServer.registerTool("honoapp.email.accounts.get", { description: "GET /email/accounts", inputSchema: {} }, async () => responseResult(
    await emailClient.email.accounts.$get(),
  ));
  mcpServer.registerTool("honoapp.email.collect.post", { description: "POST /email/collect", inputSchema: emailCollectSchema.shape }, async (json) => responseResult(
    await emailClient.email.collect.$post({ json }),
  ));
  mcpServer.registerTool("honoapp.file.get", { description: "GET /file", inputSchema: fileQuerySchema.shape }, async (query) => responseResult(
    await fileClient.file.$get({ query }),
  ));
  mcpServer.registerTool("honoapp.ssepush.post", { description: "POST /ssepush", inputSchema: ssePushSchema.shape }, async (json) => responseResult(
    await ssePushClient.ssepush.$post({ json }),
  ));

  mcpServer.registerTool("honoapp.tpl.source.get", { description: "GET /tpl/source", inputSchema: legacyWorkspacePathSchema.shape }, async (query) => responseResult(
    await tplClient.tpl.source.$get({ query }),
  ));
  mcpServer.registerTool("honoapp.tpl.source.put", { description: "PUT /tpl/source", inputSchema: tplSourceSchema.shape }, async (json) => responseResult(
    await tplClient.tpl.source.$put({ json }),
  ));
  mcpServer.registerTool("honoapp.tpl.materialize.post", { description: "POST /tpl/materialize", inputSchema: legacyWorkspacePathSchema.shape }, async (json) => responseResult(
    await tplClient.tpl.materialize.$post({ json }),
  ));
  mcpServer.registerTool("honoapp.tpl.status.get", { description: "GET /tpl/status", inputSchema: legacyWorkspacePathSchema.shape }, async (query) => responseResult(
    await tplClient.tpl.status.$get({ query }),
  ));

  mcpServer.registerTool("honoapp.tpl.global.source.get", { description: "GET /tpl/global/source", inputSchema: {} }, async () => responseResult(
    await globalTplClient.tpl.global.source.$get(),
  ));
  mcpServer.registerTool("honoapp.tpl.global.source.put", { description: "PUT /tpl/global/source", inputSchema: globalTplSourceSchema.shape }, async (json) => responseResult(
    await globalTplClient.tpl.global.source.$put({ json }),
  ));
  mcpServer.registerTool("honoapp.tpl.global.materialize.post", { description: "POST /tpl/global/materialize", inputSchema: {} }, async () => responseResult(
    await globalTplClient.tpl.global.materialize.$post(),
  ));
  mcpServer.registerTool("honoapp.tpl.global.rebase.post", { description: "POST /tpl/global/rebase", inputSchema: {} }, async () => responseResult(
    await globalTplClient.tpl.global.rebase.$post(),
  ));
  mcpServer.registerTool("honoapp.tpl.global.status.get", { description: "GET /tpl/global/status", inputSchema: {} }, async () => responseResult(
    await globalTplClient.tpl.global.status.$get(),
  ));

  mcpServer.registerTool("honoapp.tpl2.source.get", { description: "GET /tpl2/source", inputSchema: workspacePathSchema.shape }, async (query) => responseResult(
    await tpl2Client.tpl2.source.$get({ query }),
  ));
  mcpServer.registerTool("honoapp.tpl2.source.put", { description: "PUT /tpl2/source", inputSchema: sourceInputSchema.shape }, async (json) => responseResult(
    await tpl2Client.tpl2.source.$put({ json }),
  ));
  mcpServer.registerTool("honoapp.tpl2.output.filesStatus.post", { description: "POST /tpl2/output/filesStatus", inputSchema: workspacePathSchema.shape }, async (json) => responseResult(
    await tpl2Client.tpl2.output.filesStatus.$post({ json }),
  ));
  mcpServer.registerTool("honoapp.tpl2.output.materialize.post", { description: "POST /tpl2/output/materialize", inputSchema: workspacePathSchema.shape }, async (json) => responseResult(
    await tpl2Client.tpl2.output.materialize.$post({ json }),
  ));
  mcpServer.registerTool("honoapp.tpl2.output.rebase.post", { description: "POST /tpl2/output/rebase", inputSchema: workspacePathSchema.shape }, async (json) => responseResult(
    await tpl2Client.tpl2.output.rebase.$post({ json }),
  ));
}
