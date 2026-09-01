import mcpserver from "mcpserver";
import electronViteConfig from "./electron-vite-config/index.ts";
import runtimeProxy from "./runtimeproxy/index.ts";

export default mcpserver.register.register(
  electronViteConfig,
  runtimeProxy,
);
