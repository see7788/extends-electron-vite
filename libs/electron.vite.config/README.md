# electron-vite-config-lib

为 electron-vite 6.0.0-beta.1 统一配置多项目 preload、普通 React renderer 和 Hono React renderer。

## 使用接口

下面的 tree 是源码需要对齐的公开接口。

```text
electron.vite.config/
├── rendererHonoReactPlugin/
│   ├── plugin.ts                              # electron.vite.config.ts 使用
│   │   └── default(
│   │         options: {
│   │           honoHost: string;
│   │           honoPort: [
│   │             mainPort: number,            # 页面和接口统一使用；开发由 renderer Vite 监听，生产由 Hono 监听
│   │             otherPort: number,           # 仅供开发时 Electron main 内部运行 Hono
│   │           ];
│   │         },
│   │         ...reactPkg: [
│   │           path: string,                  # cwd 相对路径；package.name 作为页面路径和 out/renderer 目录名
│   │           define?: Record<string, unknown>, # 只在当前 React 项目中生效
│   │         ][]
│   │       ): {
│   │         main: Plugin;                    # 向 Electron main 生产 Hono 运行值
│   │         renderer: Plugin;                # 使用一个 renderer Vite 运行全部 React 项目
│   │       }
│   └── hono.ts                                # Electron main 项目使用
│       ├── honoServer(hono: Hono): ReturnType<typeof serve> # 使用插件生产的端口启动 Hono
│       └── honoUrl(name: package.name): string # 返回 mainPort/package.name/ 完整地址
├── rendererReactPlugin/
│   ├── plugin.ts                              # 普通 React renderer 配置使用
│   │   └── default(
│   │         options: {
│   │           otherPort: number,             # 插件内部使用
│   │         },
│   │         ...reactPkg: [
│   │           path: string,                  # cwd 相对路径；package.name 作为页面路径和 out/renderer 目录名
│   │           define?: Record<string, unknown>, # 只在当前 React 项目中生效
│   │         ][]
│   │       ): Plugin                          # 使用一个 renderer Vite 运行全部 React 项目
│   └── electron.ts
│       └── default(
│             { webContents, name }: { webContents: WebContents; name: string }
│           ): Promise<void>                   # 开发 loadURL，生产 loadFile
└── preloadCreate/
    ├── vite/
    │   ├── index.ts                           # electron-vite preload 完整配置
    │   │   └── default(
    │   │         options: {
    │   │           externalizeDeps: NonNullable<PreloadViteConfig["build"]>["externalizeDeps"];
    │   │         },
    │   │         ...reactPkg: [
    │   │           path: string,               # cwd 相对目录；固定入口 index.tsx，目录名作为 out/preload 文件名
    │   │           define?: Record<string, unknown>, # 只在当前 preload 项目中生效
    │   │         ][]
    │   │       ): PreloadViteConfig
    │   └── inlinePlugin.ts                    # index.ts 内部使用
    └── electron.ts
        └── default<Name extends string>(name: Name): string # 返回 out/preload/name.cjs 完整路径
```

## Hono React renderer

```ts
// electron.vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig, type UserConfig } from "electron-vite";
import rendererHonoReact from "electron-vite-config-lib/rendererHonoReactPlugin/plugin";

const honoReact = rendererHonoReact(
  {
    honoHost: "127.0.0.1",
    honoPort: [8788, 8789],
  },
  [
    "../admin-web",
    {
      __WEB_NAME__: JSON.stringify("admin-web"),
      __API_PATH__: JSON.stringify("/admin-web/api"),
    },
  ],
  [
    "../user-web",
    {
      __WEB_NAME__: JSON.stringify("user-web"),
      __API_PATH__: JSON.stringify("/user-web/api"),
    },
  ],
);

export default defineConfig({
  main: {
    plugins: [honoReact.main],
  },
  renderer: {
    plugins: [react(), honoReact.renderer],
  },
} satisfies UserConfig);
```

```ts
// Electron main
import { app, BrowserWindow } from "electron";
import { Hono } from "hono";
import {
  honoServer,
  honoUrl,
} from "electron-vite-config-lib/rendererHonoReactPlugin/hono";

const routers = new Hono()
  .get("/health", context => context.json({ ok: true }));

let server: ReturnType<typeof honoServer> | undefined;

app.whenReady().then(() => {
  server = honoServer(routers);
  server.once("listening", () => {
    const window = new BrowserWindow();
    void window.loadURL(honoUrl("admin-web"));
  });
});

app.on("before-quit", () => {
  server?.close();
});
```

## 普通 React renderer

```ts
// electron.vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig, type UserConfig } from "electron-vite";
import rendererReact from "electron-vite-config-lib/rendererReactPlugin/plugin";

export default defineConfig({
  renderer: {
    plugins: [
      react(),
      rendererReact(
        {
          otherPort: 5173,
        },
        [
          "../admin-web",
          {
            __WEB_NAME__: JSON.stringify("admin-web"),
          },
        ],
        ["../user-web"],
      ),
    ],
  },
} satisfies UserConfig);
```

```ts
// Electron main
import { BrowserWindow } from "electron";
import rendererLoad from "electron-vite-config-lib/rendererReactPlugin/electron";

const window = new BrowserWindow();
await rendererLoad({
  webContents: window.webContents,
  name: "admin-web",
});
```

## Preload

```ts
// electron.vite.config.ts
import { defineConfig, type UserConfig } from "electron-vite";
import preloadCreate from "electron-vite-config-lib/preloadCreate/vite/index";

export default defineConfig({
  preload: preloadCreate(
    {
      externalizeDeps: false,
    },
    [
      "src/preload/login",
      {
        __PRELOAD_NAME__: JSON.stringify("login"),
      },
    ],
    ["src/preload/settings"],
  ),
} satisfies UserConfig);
```

```ts
// Electron main
import preloadPath from "electron-vite-config-lib/preloadCreate/electron";

const webPreferences = {
  preload: preloadPath("login"),
};
```
