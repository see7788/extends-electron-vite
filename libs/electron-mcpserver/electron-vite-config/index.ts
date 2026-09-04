import mcpserver from "mcpserver";
import {
  dependenciesInstallValidator,
  electronViteConfig,
  honoValidator,
  importsEnsureValidator,
  mainPluginValidator,
  preloadConfigValidator,
  preloadPathValidator,
  readmeUri,
  rendererLoadValidator,
  rendererPluginValidator,
} from "electron-vite-config-lib/index";

const read = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;
const remoteMutate = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
} as const;

export default mcpserver.metas("electronViteConfig")
  .resource(
    "get",
    "/readme",
    readmeUri,
    {
      title: "Electron Vite 配置说明",
      description: "读取 Electron Vite、Hono、Renderer 与 Preload 的公开约定。",
      mimeType: "text/markdown",
    },
    async context =>
      context.json(await electronViteConfig.readme(context.req.query("uri"))),
  )
  .tool(
    "post",
    "/dependenciesInstall",
    dependenciesInstallValidator,
    "补齐 Electron Vite 项目依赖并执行安装。",
    remoteMutate,
    async context => {
      const result = await electronViteConfig.dependenciesInstall(
        context.req.valid("json"),
      );
      return result.status === 400
        ? context.json(result.body, 400)
        : context.json(result.body);
    },
  )
  .tool(
    "post",
    "/importsEnsure",
    importsEnsureValidator,
    "按公开能力白名单补齐项目内 TypeScript 导入。",
    remoteMutate,
    async context => {
      const result = await electronViteConfig.importsEnsure(
        context.req.valid("json"),
      );
      return result.status === 400
        ? context.json(result.body, 400)
        : context.json(result.body);
    },
  )
  .tool(
    "post",
    "/mainPlugin",
    mainPluginValidator,
    "生成 Electron Vite 主进程插件配置。",
    read,
    context =>
      context.json(electronViteConfig.mainPlugin(context.req.valid("json"))),
  )
  .tool(
    "post",
    "/rendererPlugin",
    rendererPluginValidator,
    "生成 Electron Vite 渲染器插件配置。",
    read,
    context =>
      context.json(
        electronViteConfig.rendererPlugin(context.req.valid("json")),
      ),
  )
  .tool(
    "post",
    "/preloadConfig",
    preloadConfigValidator,
    "生成 Electron Vite Preload 配置。",
    read,
    context =>
      context.json(
        electronViteConfig.preloadConfig(context.req.valid("json")),
      ),
  )
  .tool(
    "post",
    "/hono",
    honoValidator,
    "生成 Electron 主进程的 Hono 服务与渲染器地址调用。",
    read,
    context =>
      context.json(electronViteConfig.hono(context.req.valid("json"))),
  )
  .tool(
    "post",
    "/rendererLoad",
    rendererLoadValidator,
    "生成 Electron 渲染器加载调用。",
    read,
    context =>
      context.json(
        electronViteConfig.rendererLoad(context.req.valid("json")),
      ),
  )
  .tool(
    "post",
    "/preloadPath",
    preloadPathValidator,
    "生成 Electron Preload 路径调用。",
    read,
    context =>
      context.json(
        electronViteConfig.preloadPath(context.req.valid("json")),
      ),
  );
