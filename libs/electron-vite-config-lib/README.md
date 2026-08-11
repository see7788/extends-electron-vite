# electron-vite-config-lib

为同一个 Electron 应用统一配置 main、多个 React renderer 和多个 preload 入口。

```text
electron-vite-config-lib/
├─ mainPlugin/
│  ├─ plugin.ts       # main Vite 插件：注入 Hono 实际监听端口
│  └─ hono.ts         # main 运行时：启动 Hono、生成 renderer URL、生产环境托管页面
├─ rendererReactPlugin/
│  ├─ plugin.ts       # renderer Vite 插件：一个端口承载多个 React 项目
│  └─ electron.ts     # 普通 Electron renderer 的 loadURL/loadFile
├─ preloadCreate/
│  ├─ electron.ts     # 取得 out/preload/<name>.cjs
│  └─ vite/
│     └─ index.ts     # 按 package.json.name 输出多个 preload 的完整配置
├─ public.ts          # ports、paths、define 公共契约
└─ renderer.ts        # rendererPlugin 的内部实现
```

## Hono + React

`ports[0]` 是对外业务端口；`ports[1]` 只在开发时作为隐藏的 Hono 后端端口。两个插件必须消费同一个 `ports` 值。

```ts
import react from "@vitejs/plugin-react";
import { defineConfig, type UserConfig } from "electron-vite";
import mainPlugin from "electron-vite-config-lib/mainPlugin/plugin";
import rendererPlugin from "electron-vite-config-lib/rendererReactPlugin/plugin";

const ports = [8788, 8789] as const;

export default defineConfig({
  main: {
    plugins: [mainPlugin({ ports })],
  },
  renderer: {
    plugins: [
      react(),
      rendererPlugin({
        ports,
        paths: ["../admin-web/index.tsx", "../user-web/index.tsx"],
        define: {
          ADMIN_API_PATH: "/admin-web/api",
        },
      }),
    ],
  },
} satisfies UserConfig);
```

```ts
import { app, BrowserWindow } from "electron";
import { Hono } from "hono";
import {
  honoServer,
  honoUrl,
} from "electron-vite-config-lib/mainPlugin/hono";

const server = honoServer(
  new Hono().get("/health", context => context.json({ ok: true })),
);

app.whenReady().then(() => {
  server.once("listening", () => {
    const window = new BrowserWindow();
    void window.loadURL(honoUrl("admin-web"));
  });
});
```

开发时，renderer 在业务端口提供页面并把未处理请求代理到隐藏后端端口；打包后，Hono 直接监听业务端口并托管 `out/renderer`。`process.env.HONO_PORT` 是 `mainPlugin` 的保留定义，调用方不能覆盖。

## 普通 React renderer

```ts
import react from "@vitejs/plugin-react";
import { defineConfig, type UserConfig } from "electron-vite";
import rendererPlugin from "electron-vite-config-lib/rendererReactPlugin/plugin";

export default defineConfig({
  renderer: {
    plugins: [
      react(),
      rendererPlugin({
        ports: [8887, 8888],
        paths: ["./index.tsx", "../settings-renderer/index.tsx"],
      }),
    ],
  },
} satisfies UserConfig);
```

```ts
import rendererLoad from "electron-vite-config-lib/rendererReactPlugin/electron";

await rendererLoad({
  webContents: window.webContents,
  name: "settings-renderer",
  hash: "/settings",
});
```

## Preload

```ts
import { defineConfig, type UserConfig } from "electron-vite";
import preloadConfig from "electron-vite-config-lib/preloadCreate/vite/index";

export default defineConfig({
  preload: preloadConfig({
    paths: ["./src/preload/login", "./src/preload/settings"], // index.ts 或 index.tsx
  }),
} satisfies UserConfig);
```

```ts
import preloadPath from "electron-vite-config-lib/preloadCreate/electron";

const webPreferences = {
  preload: preloadPath("login"),
};
```

`define` 对所属 target 的全部入口统一生效，不支持同一 target 内按项目注入不同常量；需要项目专属全局名时使用包名前缀。

## MCP

配套包 `electron-vite-config-mcpserver` 默认导出命名空间 `electron_vite_config` 的静态 Register：

```text
electron_vite_config
├─ mainPlugin
├─ honoServer
├─ honoUrl
├─ rendererReactPlugin
├─ rendererLoad
├─ preloadCreate
└─ preloadPath
```

- `mainPlugin` 配套 `honoServer`、`honoUrl`。
- `rendererReactPlugin` 配套 `rendererLoad`。
- `preloadCreate` 配套 `preloadPath`。

七个成员都是 AI 可自主调用的只读 Tool。插件 Tool 只返回安装与配置步骤，运行时黑盒 Tool 只返回对应公开入口的调用契约；双方通过 `pairedTools` 互相指向。AI 使用普通文件操作完成目标项目修改，MCP Server 不复制 main、renderer 或 preload 的实现。
