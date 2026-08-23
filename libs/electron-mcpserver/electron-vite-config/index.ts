import mcpserver from "mcpserver";
import store from "../store";
import {
  dependenciesInstallValidator,
  honoValidator,
  importsEnsureValidator,
  mainPluginValidator,
  preloadConfigValidator,
  preloadPathValidator,
  readmeUri,
  rendererLoadValidator,
  rendererPluginValidator,
} from "./store";

const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;
const mutationAnnotations = { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true } as const;
export default mcpserver.register.slice({ registerName: "electron-vite-config" })
  .resource.register("get", "/readme", readmeUri, {
    title: "electron-vite-config-lib blackbox contract",
    description: "完整的 Electron Vite 配置、Hono、renderer 与 preload 黑盒公约。",
    mimeType: "text/markdown",
  }, async context => context.json(await store.getState().electronViteConfigActions.readme(context.req.query("uri"))))
  .tool.register("post", "/dependencies/install", dependenciesInstallValidator, "为具体 Electron-Vite application 合并 electron-vite-config-lib 及其实际使用的 peer dependencies，并执行 pnpm install。", mutationAnnotations, async context => {
    const result = await store.getState().electronViteConfigActions.dependenciesInstall(context.req.valid("json"));
    return result.status === 400 ? context.json(result.body, 400) : context.json(result.body);
  })
  .tool.register("post", "/imports/ensure", importsEnsureValidator, "按公开 capability 白名单，为项目内已有 TypeScript 文件补齐 electron-vite-config-lib 及配套 Hono/React 的精确 import。", mutationAnnotations, async context => {
    const result = await store.getState().electronViteConfigActions.importsEnsure(context.req.valid("json"));
    return result.status === 400 ? context.json(result.body, 400) : context.json(result.body);
  })
  .tool.register("post", "/mainPlugin", mainPluginValidator, "生成 electron-vite mainPlugin 的精确 import 和 electron-vite 配置片段。", annotations, context => context.json(store.getState().electronViteConfigActions.mainPlugin(context.req.valid("json"))))
  .tool.register("post", "/rendererPlugin", rendererPluginValidator, "生成 rendererReactPlugin 的精确 import 和 electron-vite renderer 配置片段。", annotations, context => context.json(store.getState().electronViteConfigActions.rendererPlugin(context.req.valid("json"))))
  .tool.register("post", "/preloadConfig", preloadConfigValidator, "生成 preloadConfig 的精确 import 和 electron-vite preload 配置片段。", annotations, context => context.json(store.getState().electronViteConfigActions.preloadConfig(context.req.valid("json"))))
  .tool.register("post", "/hono", honoValidator, "生成 Electron-Vite main runtime 的精确 Hono import、server 创建方式和 renderer URL 调用。", annotations, context => context.json(store.getState().electronViteConfigActions.hono(context.req.valid("json"))))
  .tool.register("post", "/rendererLoad", rendererLoadValidator, "生成普通 Electron renderer 的精确 rendererLoad 调用。", annotations, context => context.json(store.getState().electronViteConfigActions.rendererLoad(context.req.valid("json"))))
  .tool.register("post", "/preloadPath", preloadPathValidator, "生成 preloadPath 的精确 import 和运行时调用。", annotations, context => context.json(store.getState().electronViteConfigActions.preloadPath(context.req.valid("json"))));
