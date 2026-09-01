import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig, type UserConfig } from "electron-vite";
import mainPlugin from "electron-vite-config-lib/mainPlugin/plugin";
import preloadConfig from "electron-vite-config-lib/preloadCreate/vite/index";
import rendererPlugin from "electron-vite-config-lib/rendererReactPlugin/plugin";
import ubuntu from "ubuntu-lib/index.ts";

const ports = [3000, 3001] as const;

const config = {
  main: {
    plugins: [mainPlugin({ ports })],
    build: {
      rollupOptions: {
        input: {
          index: resolve(import.meta.dirname, "main/index.ts"),
        },
      },
    },
  },
  preload: preloadConfig({
    paths: ["../__PACKAGE_NAME__-preload/index.ts"],
  }),
  renderer: {
    server: { port: 5173 },
    plugins: [
      react(),
      rendererPlugin({
        ports,
        paths: ["../__PACKAGE_NAME__-renderer/index.tsx"],
      }),
      ubuntu.vite.dev.forward(),
    ],
  },
} satisfies UserConfig;

export default defineConfig(config);
