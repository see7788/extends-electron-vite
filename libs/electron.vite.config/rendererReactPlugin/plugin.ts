import type { Plugin } from "vite";
import { packageProjects } from "../public.ts";
import renderer from "../renderer.ts";

export default function rendererReact(
  {
    otherPort,
  }: {
    otherPort: number;
  },
  ...reactPkg: [path: string, define?: Record<string, unknown>][]
): Plugin {
  return renderer(
    { port: otherPort },
    packageProjects(...reactPkg),
  );
}
