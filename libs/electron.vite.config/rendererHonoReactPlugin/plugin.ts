import type { Plugin } from "vite";
import { packageProjects } from "../public.ts";
import renderer from "../renderer.ts";

const httpOrigin = (host: string, port: number) => {
  const urlHost = host.includes(":") && !host.startsWith("[") ? `[${host}]` : host;
  return new URL(`http://${urlHost}:${String(port)}`).origin;
};

export default function rendererHonoReact(
  {
    honoHost,
    honoPort,
  }: {
    honoHost: string;
    honoPort: [mainPort: number, otherPort: number];
  },
  ...reactPkg: [path: string, define?: Record<string, unknown>][]
): {
  main: Plugin;
  renderer: Plugin;
} {
  const [mainPort, otherPort] = honoPort;
  if (mainPort === otherPort) throw new Error("mainPort and otherPort must be different");
  const mainOrigin = httpOrigin(honoHost, mainPort);
  const otherOrigin = httpOrigin(honoHost, otherPort);
  const projects = packageProjects(...reactPkg);

  return {
    main: {
      name: "electron-hono-main",
      config(_config, configEnv) {
        const port = configEnv.mode === "production" ? mainPort : otherPort;
        return {
          define: {
            "process.env.HONOREACT_HOST": JSON.stringify(honoHost),
            "process.env.HONOREACT_ORIGIN": JSON.stringify(mainOrigin),
            "process.env.HONOREACT_PORT": JSON.stringify(String(port)),
            "process.env.HONOREACT_PROJECTS": JSON.stringify(
              projects.map(project => project.name).join(","),
            ),
          },
        };
      },
    },
    renderer: renderer(
      {
        host: honoHost,
        port: mainPort,
        proxyTarget: otherOrigin,
      },
      projects,
    ),
  };
}
