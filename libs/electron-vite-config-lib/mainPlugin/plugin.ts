import type { Plugin } from "vite";
import {
  defineRead,
  portsRead,
  type mainPlugin_t,
} from "../public.ts";

const honoPort = "process.env.HONO_PORT";

export default function mainPlugin({
  ports,
  define,
}: mainPlugin_t): Plugin {
  if (Object.hasOwn(define ?? {}, honoPort)) {
    throw new Error(`${honoPort} is reserved by mainPlugin`);
  }
  const [mainPort, otherPort] = portsRead(ports);
  const userDefine = defineRead(define);

  return {
    name: "electron-hono-main",
    config(_config, configEnv) {
      const port = configEnv.command === "serve" ? otherPort : mainPort;
      return {
        define: {
          ...userDefine,
          [honoPort]: JSON.stringify(String(port)),
        },
      };
    },
  };
}
