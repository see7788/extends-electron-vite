import type { McpTool, McpToolCallResult } from "htmlpreload/types";

export type ElectronUserBridge = {
  mcpToolsList: () => Promise<McpTool[]>;
  mcpToolCall: (name: string) => Promise<McpToolCallResult>;
};

export type { McpTool, McpToolCallResult };

declare global {
  interface Window {
    zntdElectron?: ElectronUserBridge;
  }
}
