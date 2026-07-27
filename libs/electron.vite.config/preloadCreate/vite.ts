import { existsSync } from "node:fs";
import { join } from "node:path";
import type { UserConfig } from "electron-vite";
import { packageProjects } from "../public";
import inlinePlugin from "./inlinePlugin";

export default function preloadCreate(
  { define }: Pick<NonNullable<UserConfig["preload"]>, "define">,
  ...preloadProjectRoots: string[]
): NonNullable<UserConfig["preload"]> {
  const preloadProjects = packageProjects(...preloadProjectRoots).map(({ name, root }) => {
    const entry = ["index.ts", "index.tsx"]
      .map((entryFileName) => join(root, entryFileName))
      .find(existsSync);
    if (!entry) throw new Error(`Preload index.ts or index.tsx not found: ${root}`);
    return { entry, name };
  });

  return {
    define,
    plugins: [inlinePlugin()],
    build: {
      assetsInlineLimit: Number.POSITIVE_INFINITY,
      cssCodeSplit: false,
      externalizeDeps: false,
      isolatedEntries: true,
      rollupOptions: {
        input: Object.fromEntries(preloadProjects.map(({ entry, name }) => [name, entry])),
        output: {
          entryFileNames: "[name].cjs",
          format: "cjs",
          inlineDynamicImports: true,
        },
      },
    },
  };
}
