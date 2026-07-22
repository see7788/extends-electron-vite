import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"; // Stdio MCP transport
import publicMcp from "extends-hono/createMcpServer/public"; // Shared MCP server
import "extends-hono/createMcpServer/mcp/public"; // Package MCP tools
import "./tpl2"; // Honoapp tpl2 tools

await publicMcp.server.connect(new StdioServerTransport());
