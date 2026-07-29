# electron.vite.config

为 electron-vite 统一生产多项目 preload、普通 React renderer 和 Hono React renderer 的开发、构建及业务消费入口。

## 目标公开契约

下面的 tree 是已经协商、尚待源码实施的公开契约。任意数量的 React 项目都共用同一个 Vite 开发服务。Hono React 固定使用 `[honoPort, devPort]`；普通 React renderer 固定使用一个 `devPort: number`，项目数量不会改变端口数量。

```text
extends-electron-vite.electron.vite.config/
├── rendererHonoReactPlugin/
│   ├── vitePlugin.ts                        # 生产 Hono React renderer 的 Vite 插件
│   │   └── default(
│   │         options: {
│   │           honoHost: string;
│   │           honoPort: readonly [honoPort: number, devPort: number];
│   │           webDefine?: Record<string, unknown>;
│   │         },
│   │         ...reactRoots: string[]
│   │       ): Plugin
│   ├── server.ts                            # 生产并启动正式 Hono 服务
│   │   └── default(hono: Hono): ReturnType<typeof serve>
│   ├── honoHandler.ts                       # 生产 Hono renderer 托管处理器
│   │   └── default: Handler
│   └── url.ts                               # 生产 Electron main 使用的 renderer 地址
│       └── default<Name extends string>(name: Name): string
├── rendererReactPlugin/
│   ├── vitePlugin.ts                        # 生产普通 React renderer 的 Vite 插件
│   │   └── default(
│   │         options: {
│   │           devPort: number;
│   │           webDefine?: UserConfig["define"];
│   │         },
│   │         ...reactRoots: string[]
│   │       ): Plugin
│   └── load.ts                              # 生产窗口加载能力
│       └── default({ webContents, name }: { webContents: WebContents; name: string }): Promise<void>
└── preloadCreate/
    ├── vite.ts                              # 生产 electron-vite preload 配置
    │   └── default(
    │         options: {
    │           externalizeDeps: NonNullable<PreloadViteConfig["build"]>["externalizeDeps"];
    │           preloadDefine?: PreloadViteConfig["define"];
    │         },
    │         ...preloadRoots: string[]
    │       ): PreloadViteConfig
    ├── inlinePlugin.ts                      # 包内消费的 preload 资源内联插件
    │   └── default(): Plugin
    └── path.ts                              # 生产 Electron main 使用的 preload 路径
        └── default<Name extends string>(name: Name): string
```

## 核心使用

```ts
// preload
import { defineConfig, type UserConfig } from "electron-vite";
import preloadCreate from "electron.vite.config/preloadCreate";
import preloadPath from "electron.vite.config/preloadCreate/path";

export default defineConfig({
  preload: preloadCreate(
    {
      externalizeDeps: false,
      preloadDefine: {
        __APP_NAME__: JSON.stringify("mainapp"),
      },
    },
    "../login-preload",
    "../settings-preload",
  ),
} satisfies UserConfig);

const webPreferences = {
  preload: preloadPath("login-preload"),
};
```

```ts
// 普通 React renderer
import type { BrowserWindow } from "electron";
import { defineConfig, type UserConfig } from "electron-vite";
import rendererReactVitePlugin from "electron.vite.config/rendererReactPlugin/vitePlugin";
import rendererLoad from "electron.vite.config/rendererReactPlugin/load";

export default defineConfig({
  renderer: {
    plugins: [
      rendererReactVitePlugin(
        {
          devPort: 5173,
          webDefine: {
            __APP_NAME__: JSON.stringify("mainapp"),
          },
        },
        "../admin-web",
        "../user-web",
      ),
    ],
  },
} satisfies UserConfig);

export const adminLoad = (window: BrowserWindow) => rendererLoad({
  webContents: window.webContents,
  name: "admin-web",
});
```

```ts
// Hono React renderer
import type { BrowserWindow } from "electron";
import { defineConfig, type UserConfig } from "electron-vite";
import { Hono } from "hono";
import honoHandler from "electron.vite.config/rendererHonoReactPlugin/honoHandler";
import honoServer from "electron.vite.config/rendererHonoReactPlugin/server";
import rendererHonoUrl from "electron.vite.config/rendererHonoReactPlugin/url";
import rendererHonoReactVitePlugin from "electron.vite.config/rendererHonoReactPlugin/vitePlugin";

const rendererHonoPlugin = rendererHonoReactVitePlugin(
  {
    honoHost: "127.0.0.1",
    honoPort: [8788, 5173],
    webDefine: {
      __APP_NAME__: JSON.stringify("mainapp"),
    },
  },
  "../admin-web",
  "../user-web",
);

export default defineConfig({
  renderer: {
    plugins: [rendererHonoPlugin],
  },
} satisfies UserConfig);

const app = new Hono()
  .get("/api/health", context => context.json({ ok: true }))
  .all("/:name/*", honoHandler);

honoServer(app);

export const adminLoad = (window: BrowserWindow) => (
  window.loadURL(rendererHonoUrl("admin-web"))
);
```
