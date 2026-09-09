import mcpserver from "mcpserver";
import electronViteConfig from "./electron-vite-config/index";
import runtimeProxy from "./runtimeproxy/index";

export default mcpserver.room(
  "electron",
  "Electron application, IPC, and Vite configuration capabilities.",
).register(electronViteConfig, runtimeProxy).import();
