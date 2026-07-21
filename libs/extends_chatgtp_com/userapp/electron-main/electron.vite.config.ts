import { defineConfig } from "electron-vite";
import { resolve } from "node:path";

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
      outDir: resolve(__dirname, "../electron-preload/out"),
      rollupOptions: {
        external: ["electron"],
        input: {
          index: resolve(__dirname, "../electron-preload/src/index.ts"),
        },
      },
    },
  },
});

