import mcpserver from "mcpserver";
import electronViteConfig from "./electron-vite-config/index.ts";
import runtimeProxy from "./runtimeproxy/index.ts";

export default mcpserver.room("electron", "Electron 应用、IPC 和 Vite 配置能力。").register(
  electronViteConfig,
  runtimeProxy,
).import();
