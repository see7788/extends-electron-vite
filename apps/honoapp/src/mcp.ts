import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import mcp from "extends-mcp/honomcp";
import "./tpl2";

await mcp.server.connect(new StdioServerTransport());
