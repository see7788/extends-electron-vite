import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type UserConfig } from "electron-vite";
import rendererHonoReactVitePlugin from "electron.vite.config/rendererHonoReactPlugin/vitePlugin";
import runtimeConfig from "./src/runtimeConfig/config";

const currentDir = dirname(fileURLToPath(import.meta.url));
const { host, port } = runtimeConfig.hono;
const rendererHonoPlugin = rendererHonoReactVitePlugin(
  {
    honoHost: host,
    honoPort: port,
  },
  "../admin-web",
  "../user-web",
);

const hostUserConfig = {
  main: {
    define: rendererHonoPlugin.mainDefine,
    resolve: {
      preserveSymlinks: true,
    },
    build: {
      outDir: "out/main",
      rollupOptions: {
        external: ["electron"],
        input: {
          index: resolve(currentDir, "src/routers/index.ts"),
        },
        output: {
          format: "cjs",
          entryFileNames: "[name].cjs",
        },
      },
    },
  },
  renderer: {
    plugins: [rendererHonoPlugin],
  },
} satisfies UserConfig;

export default defineConfig(hostUserConfig);
