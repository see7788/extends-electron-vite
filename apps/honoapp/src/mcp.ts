import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"; // Stdio MCP transport
import publicMcp from "extends-hono/createMcpServer/public.ts"; // Shared MCP server
import "extends-hono/createMcpServer/mcp/browser.ts"; // Package MCP tools
import "extends-hono/createMcpServer/mcp/codegraph.ts"; // Package MCP tools
import "extends-hono/createMcpServer/mcp/io.ts"; // Package MCP tools
import "./tpl2"; // Honoapp tpl2 tools

await publicMcp.server.connect(new StdioServerTransport());
