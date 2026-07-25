import { existsSync, readFileSync } from "node:fs";
import { basename, isAbsolute, join, resolve } from "node:path";
import {
  build,
  createServer,
  type Plugin,
  type UserConfig,
  type ViteDevServer,
} from "vite";

const packageName = (root: string) => {
  const { name } = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { name?: unknown };
  if (typeof name !== "string" || !/^[A-Za-z0-9._~-]+$/.test(name) || basename(root) !== name) {
    throw new Error(`React directory and package name must match one URL path segment: ${root}`);
  }
  return name;
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
    define?: UserConfig["define"];
    honoHost: string;
    honoPort: number;
  },
  ...reactRoots: string[]
): Plugin => {
  if (reactRoots.length === 0) throw new Error("At least one React root is required");
  if (reactRoots.some(isAbsolute)) throw new Error("reactRoots must be relative to process.cwd()");

  const projects = reactRoots.map(reactRoot => {
    const root = resolve(process.cwd(), reactRoot);
    if (!existsSync(join(root, "index.html"))) throw new Error(`React index.html not found: ${root}`);
    const configFile = join(root, "vite.config.ts");
    if (!existsSync(configFile)) throw new Error(`React Vite config not found: ${configFile}`);
    return { configFile, name: packageName(root), root };
  });
  if (new Set(projects.map(project => project.name)).size !== projects.length) {
    throw new Error("React package names must be unique");
  }

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
    config(config) {
      const rendererRoot = resolve(config.root ?? process.cwd());
      const rendererInput = config.build?.rolldownOptions?.input ?? config.build?.rollupOptions?.input;
      emptyRenderer = (
        config.build?.lib === undefined
        && !rendererInput
        && !existsSync(join(rendererRoot, "index.html"))
      );
      managedWrite = config.build?.write;
      return {
        define,
        build: emptyRenderer
          ? {
              rolldownOptions: { input: emptyRendererId },
              write: false,
            }
          : undefined,
      };
    },
    configResolved(config) {
      command = config.command;
      mode = config.mode;
      rendererOutDir = config.build.outDir;
      if (!emptyRenderer) managedWrite = config.build.write;
    },
    resolveId(id) {
      if (id === emptyRendererId) return `\0${emptyRendererId}`;
    },
    load(id) {
      if (id === `\0${emptyRendererId}`) return "export {}";
    },
    async configureServer(rendererServer) {
      const firstPort = Math.max(
        5174,
        honoPort + 1,
        (rendererServer.config.server.port ?? 5173) + 1,
      );
      for (const [index, project] of projects.entries()) {
        const server = await createServer({
          base: `/${project.name}/`,
          configFile: project.configFile,
          define,
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
            define,
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
