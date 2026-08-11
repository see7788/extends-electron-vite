import type { Plugin } from "vite";
import {
  defineRead,
  packageProjects,
  portsRead,
  type rendererPlugin_t,
} from "../public.ts";
import renderer from "../renderer.ts";

export default function rendererPlugin({
  ports,
  paths,
  define,
}: rendererPlugin_t): Plugin {
  const [mainPort, otherPort] = portsRead(ports);
  return renderer(
    {
      define: defineRead(define),
      host: "127.0.0.1",
      port: mainPort,
      proxyTarget: `http://127.0.0.1:${String(otherPort)}`,
    },
    packageProjects(paths),
  );
}
