import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => command === "serve"
  ? {
    plugins: [react()],
    server: {
      host: "127.0.0.1",
      port: 5173,
      strictPort: true,
      cors: { origin: /^vscode-webview:\/\// },
      hmr: { host: "127.0.0.1", port: 5173 },
    },
  }
  : {
    build: {
      emptyOutDir: true,
      outDir: "dist",
      rollupOptions: { external: ["vscode"], output: { entryFileNames: "node.js", format: "es" } },
      ssr: "src/node.ts",
      target: "node20",
    },
  });
