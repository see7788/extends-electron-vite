import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig, type UserConfig } from "electron-vite";
import mainPlugin from "electron-vite-config-lib/mainPlugin/plugin";
import preloadConfig from "electron-vite-config-lib/preloadCreate/vite/index";
import rendererPlugin from "electron-vite-config-lib/rendererReactPlugin/plugin";

const ports = [3000, 3001] as const;
export default defineConfig({
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
    paths: ["./preload/index.ts"],
  }),
  renderer: {
    plugins: [
      react(),
      rendererPlugin({
        ports,
        paths: ["./renderer/index.tsx"],
      }),
    ],
  },
});
