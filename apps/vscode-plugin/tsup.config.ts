import { defineConfig } from "tsup";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
    },
    format: ["esm"],
    outDir: "dist",
    clean: false,
    external: ["vscode"],
    platform: "node",
    noExternal: [/^honoapp(?:\/|$)/],
    splitting: false,
  },
  {
    entry: {
      index: "../honoapp/src/index.ts",
    },
    format: ["esm"],
    outDir: "dist/honoapp",
    clean: false,
    noExternal: [/.*/],
    platform: "node",
    splitting: false,
    esbuildOptions(options) {
      options.alias = {
        ...options.alias,
        "extends-hono/create-reactapp-router/index.ts": require.resolve("extends-hono/create-reactapp-router/index"),
        "extends-hono/createMcpServer/index.ts": require.resolve("extends-hono/createMcpServer/index"),
      };
    },
    banner: {
      js: [
        "import { createRequire as serviceCreateRequire } from \"node:module\";",
        "import { dirname as serviceDirname } from \"node:path\";",
        "import { fileURLToPath as serviceFileURLToPath } from \"node:url\";",
        "const require = serviceCreateRequire(import.meta.url);",
        "const __filename = serviceFileURLToPath(import.meta.url);",
        "const __dirname = serviceDirname(__filename);",
      ].join(" "),
    },
  },
]);
