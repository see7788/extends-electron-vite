# electron.vite.config

这个包为 electron-vite 提供三组配套能力：

- `preloadCreate`：把一个或多个 preload 项目分别构建成单个 CommonJS 文件。
- `rendererReactPlugin/vitePlugin`：管理不依赖 Hono 的一个或多个 React renderer 项目。
- `rendererHonoReactPlugin/vitePlugin`：管理由 Hono 提供页面入口的一个或多个 React renderer 项目。

## 统一的项目目录参数

三个构建入口都接收项目目录，不接收入口文件：

```ts
plugin(options, ...projectRoots);
```

`projectRoots` 相对于运行 electron-vite 的 `process.cwd()`。每个项目目录必须带有 `package.json`，目录名称必须与 `package.json` 的 `name` 一致；这个名称同时作为构建入口名、输出目录名或页面路径名。

不同项目类型只在默认入口约定上有区别：

| 构建入口 | 项目内入口 | 其他项目文件 |
| --- | --- | --- |
| `preloadCreate` | `index.ts`，不存在时使用 `index.tsx` | `package.json` |
| `rendererReactPlugin/vitePlugin` | `index.html` | `package.json`、`vite.config.ts` |
| `rendererHonoReactPlugin/vitePlugin` | `index.html` | `package.json`、`vite.config.ts` |

## preloadCreate

目录示例：

```text
login-preload/
├─ package.json       # name: login-preload
├─ index.ts           # 也可以只提供 index.tsx
└─ style.css
```

electron-vite 配置：

```ts
import { defineConfig, type UserConfig } from "electron-vite";
import preloadCreate from "electron.vite.config/preloadCreate";

export default defineConfig({
  preload: preloadCreate(
    {
      define: {
        __APP_NAME__: JSON.stringify("mainapp"),
      },
    },
    "../login-preload",
    "../settings-preload",
  ),
} satisfies UserConfig);
```

每个项目输出为：

```text
out/preload/<package.name>.cjs
```

`preloadCreate` 固定启用独立入口构建、CommonJS 输出和动态导入内联。普通资源由 Vite 转成内联数据；生成的 CSS 会由内置的 `inlinePlugin.ts` 移入对应入口文件，并在 DOM 可用时注入页面，因此最终不需要旁路 CSS 文件。

main 进程通过项目名称获得构建后的 preload 路径：

```ts
import preloadPath from "electron.vite.config/preloadCreate/path";

const webPreferences = {
  preload: preloadPath("login-preload"),
};
```

## rendererReactPlugin

它用于不经过 Hono、由 electron-vite renderer 开发服务直接承载的 React 项目：

```ts
import { defineConfig, type UserConfig } from "electron-vite";
import rendererReactVitePlugin from "electron.vite.config/rendererReactPlugin/vitePlugin";

export default defineConfig({
  renderer: {
    plugins: [
      rendererReactVitePlugin(
        {
          define: {
            __APP_NAME__: JSON.stringify("mainapp"),
          },
        },
        "../admin-web",
        "../user-web",
      ),
    ],
  },
} satisfies UserConfig);
```

开发时，每个 React 项目使用自己的 `vite.config.ts` 启动独立 Vite 服务，宿主 renderer 服务按 `/<package.name>/` 代理请求。构建时，每个项目写入：

```text
out/renderer/<package.name>
```

窗口加载方法同时处理开发地址和打包后的文件路径：

```ts
import rendererLoad from "electron.vite.config/rendererReactPlugin/load";

await rendererLoad({
  webContents: window.webContents,
  name: "admin-web",
});
```

## rendererHonoReactPlugin

它使用同样的 React 项目目录约定，但页面统一通过 Hono 地址访问：

```ts
import { defineConfig, type UserConfig } from "electron-vite";
import rendererHonoReactVitePlugin from "electron.vite.config/rendererHonoReactPlugin/vitePlugin";

const rendererHonoPlugin = rendererHonoReactVitePlugin(
  {
    honoHost: "127.0.0.1",
    honoPort: 8788,
    define: {
      __APP_NAME__: JSON.stringify("mainapp"),
    },
  },
  "../admin-web",
  "../user-web",
);

export default defineConfig({
  main: {
    define: rendererHonoPlugin.mainDefine,
  },
  renderer: {
    plugins: [rendererHonoPlugin],
  },
} satisfies UserConfig);
```

插件把 `__HONO_ORIGIN__` 注入 renderer，并通过 `mainDefine` 将同一常量交给 main 构建。应用启动 Hono 服务并注册自己的 API 后，再挂载 renderer handler：

```ts
import { Hono } from "hono";
import honoHandler from "electron.vite.config/rendererHonoReactPlugin/honoHandler";

const app = new Hono()
  .route("/api", api)
  .all("/:name/*", honoHandler);
```

Electron 窗口只需要项目名称：

```ts
import rendererHonoUrl from "electron.vite.config/rendererHonoReactPlugin/url";

await window.loadURL(rendererHonoUrl("admin-web"));
```

开发请求由 Hono handler 转发给对应的 React Vite 服务；打包后由同一个 handler 读取 `out/renderer/<package.name>`，调用方不需要区分环境。

## React 项目自己的 Vite 配置

两个 renderer 插件都复用各项目的 `vite.config.ts`，不会替项目注册 React 插件：

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
});
```

项目可以自行选择 `@vitejs/plugin-react`、`@vitejs/plugin-react-swc`，并维护 alias、CSS 和其他 Vite 配置。宿主只负责在唯一的 `electron.vite.config.ts` 中组合这些插件。
