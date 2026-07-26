import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    cors: { origin: /^vscode-webview:\/\// },
    hmr: { host: "127.0.0.1", port: 5173 },
  },
  optimizeDeps: { entries: ["src/react/index.tsx"] },
  build: {
    emptyOutDir: true,
    outDir: "dist",
    rollupOptions: {
      input: { node: "src/node/index.ts", react: "src/react/index.tsx" },
      external: moduleName => moduleName === "vscode" || moduleName.startsWith("node:"),
      preserveEntrySignatures: "strict",
      output: { entryFileNames: "[name].js", format: "es" },
    },
    target: "node20",
  },
});
