import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import type { PreloadViteConfig } from "electron-vite";
import {
  defineRead,
  isEntryName,
  type preloadConfig_t,
} from "../../public.ts";
import inlinePlugin from "./inlinePlugin.ts";

export default function preloadConfig({
  paths,
  define,
}: preloadConfig_t): PreloadViteConfig {
  if (paths.length === 0) throw new Error("At least one preload project is required");
  if (paths.some(path => isAbsolute(path))) {
    throw new Error("Preload paths must be relative to process.cwd()");
  }
  const projects = paths.map(path => {
    const root = resolve(process.cwd(), path);
    const packageJsonPath = join(root, "package.json");
    if (!existsSync(packageJsonPath)) {
      throw new Error(`Preload package.json not found: ${packageJsonPath}`);
    }
    const { name } = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { name?: unknown };
    const entry = ["index.ts", "index.tsx"]
      .map(file => join(root, file))
      .find(existsSync);
    if (typeof name !== "string" || !isEntryName(name)) {
      throw new Error(`Preload package.json name must be one file name segment: ${root}`);
    }
    if (!entry) throw new Error(`Preload index.ts or index.tsx not found: ${root}`);
    return { entry, name };
  });
  if (new Set(projects.map(project => project.name)).size !== projects.length) {
    throw new Error("Preload project directory names must be unique");
  }

  return {
    define: defineRead(define),
    plugins: [inlinePlugin()],
    build: {
      assetsInlineLimit: Number.POSITIVE_INFINITY,
      cssCodeSplit: false,
      externalizeDeps: false,
      isolatedEntries: true,
      rolldownOptions: {
        input: Object.fromEntries(projects.map(project => [project.name, project.entry])),
        output: {
          codeSplitting: false,
          entryFileNames: "[name].cjs",
          format: "cjs",
        },
      },
    },
  };
}
