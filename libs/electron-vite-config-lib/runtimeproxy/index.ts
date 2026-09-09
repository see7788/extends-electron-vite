import mcpserver from "mcpserver";
import { z } from "zod";

const packageImportValidator = z.object({
  side: z.enum(["main", "preload", "renderer"]),
}).strict();

const packageImport = (input: z.output<typeof packageImportValidator>) => {
  const value = packageImportValidator.parse(input);
  const imports = {
    main: 'import { ElectronMainCommunication } from "electron-ipc/main";',
    preload: 'import { ElectronPreloadClient } from "electron-ipc/preload";',
    renderer: 'import { ElectronRendererCommunication } from "electron-ipc/renderer";',
  } as const;
  return {
    packageName: "electron-ipc" as const,
    side: value.side,
    import: imports[value.side],
    next: "使用返回的 side 对应适配器注册或消费 IPC 路由。",
  };
};

export default mcpserver.metas("electronRuntimeProxy")
  .tool(
    "post",
    "/packageImport",
    packageImportValidator,
    "返回 Electron IPC 对应运行端的真实入口导入。",
    {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    context =>
      context.json(packageImport(context.req.valid("json"))),
  );
