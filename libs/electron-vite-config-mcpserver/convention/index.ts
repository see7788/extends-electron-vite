import { zValidator } from "@hono/zod-validator";
import mcpserver from "mcpserver";
import store from "../store";
import { conventionValidator } from "./store";

const convention = mcpserver.RegisterSlice({
  sliceName: "electron_vite_config",
  description: "使用 electron-vite-config-lib 配置 main、renderer 与 preload",
}).tool.register(
    "post",
    "/mainPlugin/read",
    conventionValidator,
    "取得 Electron main 与 Hono 的完整接入步骤：安装依赖、配置 mainPlugin，并配套使用 honoServer 与 honoUrl。",
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    zValidator("json", conventionValidator),
    async context => context.json(
      await store.getState().conventionActions.mainPlugin.read(context.req.valid("json")),
    ),
).tool.register(
    "post",
    "/honoServer/read",
    conventionValidator,
    "取得 mainPlugin/hono 的 honoServer 运行时黑盒用法。",
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    zValidator("json", conventionValidator),
    async context => context.json(
      await store.getState().conventionActions.honoServer.read(context.req.valid("json")),
    ),
).tool.register(
    "post",
    "/honoUrl/read",
    conventionValidator,
    "取得 mainPlugin/hono 的 honoUrl 运行时黑盒用法。",
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    zValidator("json", conventionValidator),
    async context => context.json(
      await store.getState().conventionActions.honoUrl.read(context.req.valid("json")),
    ),
).tool.register(
    "post",
    "/rendererReactPlugin/read",
    conventionValidator,
    "取得 React renderer 的完整接入步骤：安装依赖、配置 rendererReactPlugin，并配套使用 rendererLoad。",
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    zValidator("json", conventionValidator),
    async context => context.json(
      await store.getState().conventionActions.rendererReactPlugin.read(context.req.valid("json")),
    ),
).tool.register(
    "post",
    "/rendererLoad/read",
    conventionValidator,
    "取得 rendererReactPlugin/electron 的 rendererLoad 运行时黑盒用法。",
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    zValidator("json", conventionValidator),
    async context => context.json(
      await store.getState().conventionActions.rendererLoad.read(context.req.valid("json")),
    ),
).tool.register(
    "post",
    "/preloadCreate/read",
    conventionValidator,
    "取得 preload 的完整接入步骤：安装依赖、配置 preloadCreate，并配套使用 preloadPath。",
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    zValidator("json", conventionValidator),
    async context => context.json(
      await store.getState().conventionActions.preloadCreate.read(context.req.valid("json")),
    ),
).tool.register(
    "post",
    "/preloadPath/read",
    conventionValidator,
    "取得 preloadCreate/electron 的 preloadPath 运行时黑盒用法。",
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    zValidator("json", conventionValidator),
    async context => context.json(
      await store.getState().conventionActions.preloadPath.read(context.req.valid("json")),
    ),
);

export default convention;
