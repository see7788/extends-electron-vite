import { resolve } from "node:path";
import { defineConfig } from "electron-vite";

export default defineConfig({
  main: {
    build: {
      outDir: "out/main",
      rollupOptions: {
        external: ["electron"],
        input: {
          index: resolve(__dirname, "src/index.ts"),
        },
      },
    },
  },
  preload: {
    build: {
      outDir: resolve(__dirname, "../user-electron-preload/out"),
      rollupOptions: {
        external: ["electron"],
        input: {
          index: resolve(__dirname, "../user-electron-preload/src/index.ts"),
        },
      },
    },
  },
});
