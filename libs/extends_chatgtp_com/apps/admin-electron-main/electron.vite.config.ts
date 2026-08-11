import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type UserConfig } from "electron-vite";
import mainPlugin from "electron-vite-config-lib/mainPlugin/plugin";
import rendererPlugin from "electron-vite-config-lib/rendererReactPlugin/plugin";

const currentDir = dirname(fileURLToPath(import.meta.url));
const ports = [8788, 8789] as const;

const hostUserConfig = {
  main: {
    plugins: [mainPlugin({ ports })],
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
    plugins: [
      react(),
      rendererPlugin({
        ports,
        paths: ["../admin-web/index.tsx", "../user-web/index.tsx"],
      }),
    ],
  },
} satisfies UserConfig;

export default defineConfig(hostUserConfig);
