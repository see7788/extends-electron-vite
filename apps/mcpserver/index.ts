import { StreamableHTTPTransport } from "@hono/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Hono } from "hono";
import honoappMcpRegister from "honoapp/src/mcp";

const app = new Hono();
const mcpServer = new McpServer({
  name: "extends-mcpserver",
  version: "0.0.0",
});
const transport = new StreamableHTTPTransport();

honoappMcpRegister(mcpServer);

app.all("/mcp", async (context) => {
  if (!mcpServer.isConnected()) await mcpServer.connect(transport);
  return transport.handleRequest(context);
});

export default app;
