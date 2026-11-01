import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "electron-vite";
import declarationTemplatePlugin from "./electron.vite/plugins/declarationPlugin";
import mainPlugin from "./electron.vite/plugins/mainPlugin";
import preloadConfig from "./electron.vite/plugins/preloadPlugin";
import rendererPlugin from "./electron.vite/plugins/rendererPlugin";

const ports = [3000, 3001] as const;

export default defineConfig({
  main: {
    plugins: [declarationTemplatePlugin({ ports, preloadNames: ["preload"], rendererNames: ["renderer"] }), mainPlugin({ ports })],
    build: { rollupOptions: { input: { index: resolve(import.meta.dirname, "main/index.ts") } } },
  },
  preload: preloadConfig({ paths: ["./preload/index.ts"] }),
  renderer: { plugins: [react(), rendererPlugin({ ports, paths: ["./renderer/index/index.tsx"] })] },
});
