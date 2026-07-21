import type { BrowserWindow } from "electron";
import { join } from "node:path";
import userPackage from "../../package.json";

export type McpTool = {
  name: string;
  description: string;
};

export type McpToolCallResult = {
  content: string;
};

const rootDir = join(__dirname, "..", "..", "..", "..", "..");

export default {
  rootDir,
  hostPreloadPath: join(rootDir, "apps", "user-electron-preload", "out", "index.js"),
  hostWindow: undefined as BrowserWindow | undefined,
  userWebUrl: userPackage.config.userWebUrl,
  mcpTools: [
    {
      name: "app.info",
      description: "读取 User 壳信息",
    },
    {
      name: "time.now",
      description: "读取当前本机时间",
    },
    {
      name: "clipboard.read",
      description: "读取当前剪贴板文本",
    },
    {
      name: "screen.info",
      description: "读取当前屏幕信息",
    },
  ] satisfies McpTool[],
};
