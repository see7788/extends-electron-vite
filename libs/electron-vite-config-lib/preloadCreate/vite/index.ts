import type { PreloadViteConfig } from "electron-vite";
import {
  defineRead,
  packageEntries,
  type preloadConfig_t,
} from "../../public";
import inlinePlugin from "./inlinePlugin";

export type preloadEntryPath_t = preloadConfig_t["paths"][number];

export default function preloadConfig({
  paths,
  define,
}: preloadConfig_t): PreloadViteConfig {
  const projects = packageEntries(paths, "Preload");

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
