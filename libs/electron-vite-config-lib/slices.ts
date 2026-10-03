import mcpserver from "mcpserver";
import electronViteConfig from "./electron-vite-config/index";
import runtimeProxy from "./runtimeproxy/index";

export default mcpserver.metas()
  .metas(electronViteConfig, runtimeProxy)
  .import(["electron-vite", "Electron application, IPC, and Vite configuration capabilities."]);
