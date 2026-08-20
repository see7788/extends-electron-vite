# electron-vite-config-lib

为同一个 Electron 应用统一配置 main、多个 React renderer 和多个 preload 入口。

接入时使用目标项目现有的包管理器声明 `electron-vite-config-lib` 和实际用到的 peer dependencies；不要假定目标项目使用 pnpm。以下公开入口是完整黑盒契约，调用方不复制其内部实现。

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
└─ public.ts          # 共享契约、校验与 renderer 的 Vite 实现
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

这是 Hono + React 工作流：`mainPlugin`、`rendererPlugin`、`honoServer` 和 `honoUrl` 必须配套使用。`honoServer(app: Hono)` 返回 Node Server，并在 Hono 响应 404 后处理生产静态资源与 SPA 回退；`honoUrl(name)` 的 `name` 必须等于 renderer 入口目录的 `package.json#name`。

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

这是不经 Hono 页面地址的普通 renderer 工作流。`rendererLoad({ webContents, name, hash? })` 在开发时调用 `loadURL`，打包后调用 `loadFile`；`name` 必须等于 renderer 入口目录的 `package.json#name`，调用方不判断 `app.isPackaged`，也不拼接开发 URL 或输出路径。

## Preload

```ts
import { defineConfig, type UserConfig } from "electron-vite";
import preloadConfig from "electron-vite-config-lib/preloadCreate/vite/index";

export default defineConfig({
  preload: preloadConfig({
    paths: ["./src/preload/login/index.ts", "./src/preload/settings/index.ts"],
  }),
} satisfies UserConfig);
```

```ts
import preloadPath from "electron-vite-config-lib/preloadCreate/electron";

const webPreferences = {
  preload: preloadPath("login"),
};
```

`preloadConfig({ paths, define? })` 按各入口目录的 `package.json#name` 生成 `out/preload/<name>.cjs`；`preloadPath(name)` 返回对应路径。两者必须配套使用，调用方不拼接 `out/preload`。

`define` 对所属 target 的全部入口统一生效，不支持同一 target 内按项目注入不同常量；需要项目专属全局名时使用包名前缀。

renderer 与 preload 的 `paths` 都是非空入口数组；入口必须以 `.` 开始，并命名为 `index.ts` 或 `index.tsx`。
renderer 入口目录不提供 `index.html`；插件集中生成最小 HTML，并由 Vite 在一次原生多入口构建中输出全部 renderer。
