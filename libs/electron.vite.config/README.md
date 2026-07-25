# electron.vite.config

`rendererHonoReactPlugin/plugin` 在不替换 electron-vite 现有 renderer、main 和 preload 配置的前提下，将一个或多个 React 项目挂载到 Hono。

```ts
import { defineConfig } from "electron-vite";
import rendererHonoReactPlugin from "electron.vite.config/rendererHonoReactPlugin/plugin";

export default defineConfig({
  renderer: {
    plugins: [
      rendererHonoReactPlugin(
        {
          honoHost: "127.0.0.1",
          honoPort: 8788,
          define: {
            __APP_CONFIG__: {
              app: { name: "zntd" },
            },
          },
        },
        "../admin-web",
        "../user-web",
      ),
    ],
  },
});
```

```text
rendererHonoReactPlugin/
├─ plugin.ts                # 扩展 electron-vite renderer
│  ├─ 开发环境              # 启动带 HMR 的独立 React Vite 服务
│  └─ 生产构建              # 将各 React 项目写入 renderer 输出目录
└─ honoHandler.ts           # 将 Hono 请求转给开发服务或生产页面
```

React 路径相对于 `process.cwd()`。每个目录的名称必须与其 `package.json` 的 `name` 一致，并包含 `index.html` 和 `vite.config.ts`。

## React 项目配置

公共插件不会安装或注册 `@vitejs/plugin-react`。每个 React 项目自行提供完整的 Vite 配置：

```ts
// apps/admin-web/vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
});
```

项目也可以改用 `@vitejs/plugin-react-swc`，或配置自己的 alias、CSS 选项和其他 Vite 插件，不需要修改 `electron.vite.config`。

开发时，插件使用项目自己的 `vite.config.ts` 调用 Vite `createServer()`，再把开发地址交给 `honoHandler`。生产构建时，插件使用同一份配置调用 Vite `build()`，并将结果写入：

```text
out/renderer/<package.name>
```

插件只管理 renderer 项目。Electron main、preload、进程启动和 Hono 服务启动仍由 electron-vite 与应用负责。

## 挂载 Hono

API 路由注册完成后，再挂载 `rendererHonoReactPlugin/honoHandler`：

```ts
import honoHandler from "electron.vite.config/rendererHonoReactPlugin/honoHandler";

const app = new Hono()
  .route("/", api)
  .all("/:name/*", honoHandler);
```

Electron 窗口始终使用 Hono 地址调用 `loadURL()`，例如：

```text
http://127.0.0.1:8788/admin-web/
```

开发请求会转给对应的 Vite 服务；生产请求读取 `out/renderer/<package.name>/index.html`。
