import react from "@vitejs/plugin-react";
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
import type { UserConfig } from "electron-vite";

const packageName = (root: string) => {
  const { name } = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { name?: unknown };
  if (typeof name !== "string" || !/^[A-Za-z0-9._~-]+$/.test(name)) {
    throw new Error(`package.json name must be one URL path segment: ${root}`);
  }
  if (basename(root) !== name) throw new Error(`React directory and package name must match: ${root}`);
  return name;
};

export default (
  {
    mainEntry,
    rendererPort,
  }: {
    mainEntry: string;
    rendererPort: number;
  },
  ...reactRoots: string[]
): UserConfig => {
  if (isAbsolute(mainEntry) || reactRoots.some(isAbsolute)) {
    throw new Error("mainEntry and reactRoots must be relative to process.cwd()");
  }
  if (reactRoots.length === 0) throw new Error("At least one React root is required");

  const cwd = process.cwd();
  const entry = resolve(cwd, mainEntry);
  if (!existsSync(entry)) throw new Error(`Electron main entry not found: ${entry}`);
  const roots = reactRoots.map(root => resolve(cwd, root));
  const rendererRoot = dirname(roots[0]);
  if (roots.some(root => dirname(root) !== rendererRoot)) {
    throw new Error("React projects must share one parent directory");
  }
  const inputs = Object.fromEntries(roots.map(root => {
    const name = packageName(root);
    const html = join(root, "index.html");
    if (!existsSync(html)) throw new Error(`React index.html not found: ${html}`);
    return [`${name}/index`, html];
  }));

  return {
    main: {
      build: {
        outDir: resolve(cwd, "out", "main"),
        rollupOptions: {
          input: { index: entry },
          output: { entryFileNames: "index.js" },
        },
      },
    },
    renderer: {
      base: "./",
      root: rendererRoot,
      build: {
        outDir: resolve(cwd, "out", "renderer"),
        rollupOptions: { input: inputs },
      },
      plugins: [react()],
      server: {
        host: "127.0.0.1",
        port: rendererPort,
        strictPort: true,
        hmr: {
          host: "127.0.0.1",
          clientPort: rendererPort,
        },
      },
    },
  };
};
