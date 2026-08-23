import mcpserver from "mcpserver";
import store from "../store";
import { packageImportValidator } from "./store";

export default mcpserver
  .RegisterSlice({ sliceName: "electron-runtimeproxy" })
  .tool.register(
    "post",
    "/packageImport",
    packageImportValidator,
    "返回 Electron-Vite runtimeproxy 对应运行端的真实入口 import。",
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    context => context.json(store.getState().runtimeProxyActions.packageImport(context.req.valid("json"))),
  );
