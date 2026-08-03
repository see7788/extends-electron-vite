import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type UserConfig } from "electron-vite";
import rendererHonoReact from "electron-vite-config-lib/rendererHonoReactPlugin/plugin";

const currentDir = dirname(fileURLToPath(import.meta.url));
const honoReact = rendererHonoReact(
  {
    honoHost: "127.0.0.1",
    honoPort: [8788, 8789],
  },
  ["../admin-web"],
  ["../user-web"],
);

const hostUserConfig = {
  main: {
    plugins: [honoReact.main],
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
    plugins: [react(), honoReact.renderer],
  },
} satisfies UserConfig;

export default defineConfig(hostUserConfig);
