import { existsSync } from "node:fs";
import { basename, isAbsolute, join, resolve } from "node:path";
import type { PreloadViteConfig } from "electron-vite";
import type { Plugin } from "vite";
import { isEntryName } from "../../public.ts";
import inlinePlugin from "./inlinePlugin.ts";

const projectDefine = (define?: Record<string, unknown>) => Object.fromEntries(
  Object.entries(define ?? {}).map(([name, value]) => {
    if (typeof value === "string") return [name, value];
    const serialized = JSON.stringify(value);
    if (serialized === undefined) throw new Error(`define ${name} cannot be serialized`);
    return [name, serialized];
  }),
);

export default function preloadCreate(
  {
    externalizeDeps,
  }: {
    externalizeDeps: NonNullable<PreloadViteConfig["build"]>["externalizeDeps"];
  },
  ...reactPkg: [path: string, define?: Record<string, unknown>][]
): PreloadViteConfig {
  if (reactPkg.length === 0) throw new Error("At least one preload project is required");
  if (reactPkg.some(([path]) => isAbsolute(path))) {
    throw new Error("Preload paths must be relative to process.cwd()");
  }
  const projects = reactPkg.map(([path, define]) => {
    const root = resolve(process.cwd(), path);
    const name = basename(root);
    const entry = join(root, "index.tsx");
    if (!isEntryName(name)) throw new Error(`Invalid preload project directory name: ${name}`);
    if (!existsSync(entry)) throw new Error(`Preload index.tsx not found: ${entry}`);
    return { define: projectDefine(define), entry, name };
  });
  if (new Set(projects.map(project => project.name)).size !== projects.length) {
    throw new Error("Preload project directory names must be unique");
  }

  const definePlugin: Plugin = {
    name: "electron-preload-define",
    config(config) {
      const input = config.build?.rolldownOptions?.input
        ?? config.build?.rollupOptions?.input;
      if (!input || Array.isArray(input) || typeof input !== "object") return;
      const entries = Object.values(input);
      if (entries.length !== 1 || typeof entries[0] !== "string") return;
      const entry = resolve(entries[0]);
      const project = projects.find(current => current.entry === entry);
      if (project) return { define: project.define };
    },
  };

  return {
    plugins: [definePlugin, inlinePlugin()],
    build: {
      assetsInlineLimit: Number.POSITIVE_INFINITY,
      cssCodeSplit: false,
      externalizeDeps,
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
