# electron.vite.config

`honoRenderer/plugin` adds Hono-mounted React projects to an existing electron-vite renderer without replacing its page, main, or preload configuration.

```ts
import { defineConfig } from "electron-vite";
import honoRenderer from "electron.vite.config/honoRenderer/plugin";

export default defineConfig({
  renderer: {
    plugins: [
      honoRenderer(
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
honoRenderer/
├── plugin.ts                # Extends only the electron-vite renderer
│   ├── development          # Starts isolated React Vite servers with HMR
│   └── build                # Writes each React project below renderer outDir
└── honoHandler.ts           # Routes Hono requests to development or built pages
```

React paths are relative to `process.cwd()`. Each directory name must equal its `package.json` name and contain `index.html` and `vite.config.ts`. Each React project owns its Vite plugins; the shared `define` also applies to the existing renderer page.

Register `honoRenderer/honoHandler` after API routes:

```ts
import honoHandler from "electron.vite.config/honoRenderer/honoHandler";

const app = new Hono()
  .route("/", api)
  .all("/:name/*", honoHandler);
```

The Electron window always uses `loadURL()` with the Hono address, such as `http://127.0.0.1:8788/admin-web/`. Development requests use the managed Vite server; production requests read `out/renderer/<package.name>/index.html`.
