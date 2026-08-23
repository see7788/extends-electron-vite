import mcpserver from "mcpserver";
import electronViteConfig from "./electron-vite-config/index";
import runtimeproxy from "./runtimeproxy/index";

export default mcpserver.import({
  packageName: "electron-mcpserver",
  description: "为 Electron Vite 项目提供配置与 runtime proxy 工具。",
  RegisterAny: [electronViteConfig, runtimeproxy],
});
