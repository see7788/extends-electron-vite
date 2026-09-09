import mcpserver from "mcpserver";
import electronViteConfig from "./electron-vite-config/index";
import runtimeProxy from "./runtimeproxy/index";

export default mcpserver.metas("electron")
  .metas(electronViteConfig, runtimeProxy)
  .import(["electron", "Electron application, IPC, and Vite configuration capabilities."]);
