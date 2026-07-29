import { existsSync } from "node:fs";
import type { PreloadViteConfig } from "electron-vite";
import { isEntryName } from "../public.ts";
import inlinePlugin from "./inlinePlugin.ts";

export default function preloadCreate(
  {
    externalizeDeps,
    preloadDefine,
  }: {
    externalizeDeps: NonNullable<PreloadViteConfig["build"]>["externalizeDeps"];
    preloadDefine?: PreloadViteConfig["define"];
  },
  ...preloadEntryGroups: Record<string, string>[]
): PreloadViteConfig {
  const preloadEntries = Object.entries(
    Object.assign({} as Record<string, string>, ...preloadEntryGroups),
  ) as [string, string][];
  const preloadEntryCount = preloadEntryGroups.reduce(
    (count, entries) => count + Object.keys(entries).length,
    0,
  );
  if (preloadEntries.length !== preloadEntryCount) {
    throw new Error("Preload entry names must be unique");
  }
  for (const [name, entry] of preloadEntries) {
    if (!isEntryName(name)) throw new Error(`Invalid preload entry name: ${name}`);
    if (!existsSync(entry)) throw new Error(`Preload entry not found: ${entry}`);
  }

  return {
    define: preloadDefine,
    plugins: [inlinePlugin()],
    build: {
      assetsInlineLimit: Number.POSITIVE_INFINITY,
      cssCodeSplit: false,
      externalizeDeps,
      isolatedEntries: true,
      rollupOptions: {
        input: Object.fromEntries(preloadEntries),
        output: {
          entryFileNames: "[name].cjs",
          format: "cjs",
          inlineDynamicImports: true,
        },
      },
    },
  };
}
