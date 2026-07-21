import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "electron-vite";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  main: {
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
});
