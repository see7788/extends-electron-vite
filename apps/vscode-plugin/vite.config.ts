import { builtinModules } from "node:module";
import react from "@vitejs/plugin-react";
import store from "honoapp/src/store";
import { defineConfig } from "vite";

const { hostname: honoHost, port: honoPort } = store.getState().runtimeActions;
const nodeBuiltins = new Set(builtinModules.map(moduleName => moduleName.replace(/^node:/, "")));

export default defineConfig(({ mode }) => {
  if (mode === "drawer-development") return {
    plugins: [react()],
    server: {
      host: "127.0.0.1",
      port: 5173,
      strictPort: true,
      cors: { origin: /^vscode-webview:\/\// },
      hmr: { host: "127.0.0.1", port: 5173 },
    },
  };
  if (mode === "drawer-production") return {
    plugins: [react()],
    build: {
      emptyOutDir: false,
      lib: { entry: "src/react.tsx", formats: ["es"], fileName: "react" },
      outDir: "dist",
    },
  };
  if (mode === "extension-development" || mode === "extension-production") return {
    build: {
      emptyOutDir: true,
      outDir: "dist",
      rollupOptions: {
        external: moduleName => moduleName === "vscode" || moduleName.startsWith("node:") || nodeBuiltins.has(moduleName),
        output: { entryFileNames: "node.js", format: "es", paths: moduleName => nodeBuiltins.has(moduleName) ? `node:${moduleName}` : moduleName },
      },
      ssr: "src/node.ts",
      target: "node20",
    },
    define: {
      "import.meta.env.VITE_HONO_HOST": JSON.stringify(honoHost),
      "import.meta.env.VITE_HONO_PORT": JSON.stringify(String(honoPort)),
    },
  };
  throw new Error(`Unknown mode: ${mode}`);
});
