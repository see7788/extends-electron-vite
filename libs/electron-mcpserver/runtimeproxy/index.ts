import mcpserver from "mcpserver";
import {
  packageImportValidator,
  runtimeProxy,
} from "electron-vite-runtimeproxy/index";

export default mcpserver.register
  .slice("electronRuntimeProxy")
  .tool(
    "post",
    "/packageImport",
    packageImportValidator,
    "返回 Electron Vite RuntimeProxy 对应运行端的真实入口导入。",
    {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    context =>
      context.json(runtimeProxy.packageImport(context.req.valid("json"))),
  );
