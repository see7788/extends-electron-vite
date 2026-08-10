import type { Plugin } from "vite";
import { packageProjects, type reactPkg_t } from "../public.ts";
import renderer from "../renderer.ts";

const httpOrigin = (host: string, port: number) => {
  const urlHost = host.includes(":") && !host.startsWith("[") ? `[${host}]` : host;
  return new URL(`http://${urlHost}:${String(port)}`).origin;
};

export const rendererHonoReact = (
  {
    honoHost,
    honoPort,
  }: {
    honoHost: string;
    honoPort: [mainPort: number, otherPort: number];
  },
  ...reactPkg: reactPkg_t[]
): {
  main: Plugin;
  renderer: Plugin;
} => {
  const [mainPort, otherPort] = honoPort;
  if (mainPort === otherPort) throw new Error("mainPort and otherPort must be different");
  const mainOrigin = httpOrigin(honoHost, mainPort);
  const otherOrigin = httpOrigin(honoHost, otherPort);
  const projects = packageProjects(...reactPkg);

  return {
    main: {
      name: "electron-hono-main",
      config(_config, configEnv) {
        const port = configEnv.command === "build" ? mainPort : otherPort;
        return {
          define: {
            "process.env.ELECTRON_RENDERER_HONO_HOST": JSON.stringify(honoHost),
            "process.env.ELECTRON_RENDERER_HONO_ORIGIN": JSON.stringify(mainOrigin),
            "process.env.ELECTRON_RENDERER_HONO_PORT": JSON.stringify(String(port)),
            "process.env.ELECTRON_RENDERER_HONO_PROJECTS": JSON.stringify(
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
};

export default function rendererReact(
  {
    otherPort,
  }: {
    otherPort: number;
  },
  ...reactPkg: reactPkg_t[]
): Plugin {
  return renderer(
    { port: otherPort },
    packageProjects(...reactPkg),
  );
}
