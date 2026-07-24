# electron.vite.config

`honoreact/createUserConfig` creates one electron-vite `UserConfig` for an Electron main entry and sibling React projects. Paths are relative to `process.cwd()`. Each React directory name must equal its `package.json` name.

```ts
import { defineConfig } from "electron-vite";
import createUserConfig from "electron.vite.config/honoreact/createUserConfig";

export default defineConfig(createUserConfig(
  {
    honoEntry: "src/routers/index.ts",
    honoHost: "127.0.0.1",
    honoPort: 8788,
  },
  "../admin-web",
  "../user-web",
));
```

The Electron main project explicitly starts its Hono server. Register `honoreact/honoHandler` after API routes as the React fallback:

```ts
import honoHandler from "electron.vite.config/honoreact/honoHandler";

const app = new Hono()
  .route("/", api)
  .all("/:name/*", honoHandler);
```

The Electron window always loads the Hono URL, such as `http://127.0.0.1:8788/admin-web/`. Development requests use electron-vite's renderer server; production requests read `out/renderer/<package.name>/index.html`. Preload entries remain project-owned and can be merged into the returned `UserConfig`.
