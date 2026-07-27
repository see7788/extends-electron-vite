import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  build,
  createServer,
  type ViteDevServer,
} from "vite";
import { packageProjects } from "../public.ts";

type RendererConfig = {
  root?: string;
  build?: {
    lib?: unknown;
    rollupOptions?: {
      input?: unknown;
    };
    write?: boolean;
  };
  server?: {
    port?: number;
  };
};

const developmentUrl = (server: ViteDevServer) => {
  const origin = server.resolvedUrls?.local[0] ?? server.resolvedUrls?.network[0];
  if (!origin) throw new Error("Cannot resolve a React development server URL");
  return new URL(server.config.base, origin).toString();
};

export default (
  {
    define,
    honoHost,
    honoPort,
  }: {
    define?: Record<string, unknown>;
    honoHost: string;
    honoPort: number;
  },
  ...reactRoots: string[]
) => {
  const mainDefine = {
    __HONO_ORIGIN__: JSON.stringify(`http://${honoHost}:${honoPort}`),
  };
  const rendererDefine = {
    ...define,
    ...mainDefine,
  };
  const projects = packageProjects(...reactRoots).map(({ name, root }) => {
    if (!existsSync(join(root, "index.html"))) throw new Error(`React index.html not found: ${root}`);
    const configFile = join(root, "vite.config.ts");
    if (!existsSync(configFile)) throw new Error(`React Vite config not found: ${configFile}`);
    return { configFile, name, root };
  });

  const servers: ViteDevServer[] = [];
  const emptyRendererId = "virtual:electron-hono-renderer";
  let command: "build" | "serve";
  let emptyRenderer = false;
  let managedWrite: boolean | undefined;
  let mode: string;
  let rendererOutDir: string;
  let built = false;

  return {
    name: "electron-hono-renderer",
    mainDefine,
    config(config: RendererConfig) {
      const rendererRoot = resolve(config.root ?? process.cwd());
      const rendererInput = config.build?.rollupOptions?.input;
      emptyRenderer = (
        config.build?.lib === undefined
        && !rendererInput
        && !existsSync(join(rendererRoot, "index.html"))
      );
      managedWrite = config.build?.write;
      return {
        define: rendererDefine,
        build: emptyRenderer
          ? {
              rolldownOptions: { input: emptyRendererId },
              rollupOptions: { input: emptyRendererId },
              write: false,
            }
          : undefined,
      };
    },
    configResolved(config: {
      command: "build" | "serve";
      mode: string;
      build: {
        outDir: string;
        write?: boolean;
      };
    }) {
      command = config.command;
      mode = config.mode;
      rendererOutDir = config.build.outDir;
      if (!emptyRenderer) managedWrite = config.build.write;
    },
    resolveId(id: string) {
      if (id === emptyRendererId) return `\0${emptyRendererId}`;
    },
    load(id: string) {
      if (id === `\0${emptyRendererId}`) return "export {}";
    },
    async configureServer(rendererServer: {
      config: {
        server: {
          port: number;
        };
      };
    }) {
      const firstPort = Math.max(
        5174,
        honoPort + 1,
        (rendererServer.config.server.port ?? 5173) + 1,
      );
      for (const [index, project] of projects.entries()) {
        const server = await createServer({
          base: `/${project.name}/`,
          configFile: project.configFile,
          define: rendererDefine,
          mode,
          root: project.root,
          server: {
            host: honoHost,
            port: firstPort + index,
            strictPort: true,
            hmr: { host: honoHost, clientPort: firstPort + index },
          },
        });
        servers.push(server);
        await server.listen();
        process.env[`HONO_RENDERER_URL_${project.name}`] = developmentUrl(server);
      }
    },
    async closeBundle() {
      if (command === "build") {
        if (built) return;
        built = true;
        for (const project of projects) {
          await build({
            base: "./",
            build: {
              emptyOutDir: true,
              outDir: join(rendererOutDir, project.name),
              write: managedWrite,
            },
            configFile: project.configFile,
            define: rendererDefine,
            mode,
            root: project.root,
          });
        }
        return;
      }
      await Promise.allSettled(servers.splice(0).map(server => server.close()));
      for (const project of projects) delete process.env[`HONO_RENDERER_URL_${project.name}`];
    },
  };
};
