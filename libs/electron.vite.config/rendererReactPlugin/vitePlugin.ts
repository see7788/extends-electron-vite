import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  build,
  createServer,
  type Plugin,
  type UserConfig,
  type ViteDevServer,
} from "vite";
import { packageProjects } from "../public";

export default (
  { define }: { define?: UserConfig["define"] },
  ...reactRoots: string[]
): Plugin => {
  const projects = packageProjects(...reactRoots).map(({ name, root }) => {
    if (!existsSync(join(root, "index.html"))) throw new Error(`React index.html not found: ${root}`);
    const configFile = join(root, "vite.config.ts");
    if (!existsSync(configFile)) throw new Error(`React Vite config not found: ${configFile}`);
    return { configFile, name, root };
  });

  const servers: ViteDevServer[] = [];
  const emptyRendererId = "virtual:electron-renderer";
  let command: "build" | "serve";
  let emptyRenderer = false;
  let managedWrite: boolean | undefined;
  let mode: string;
  let rendererOutDir: string;
  let rendererPort = 5173;
  let built = false;
  const projectProxy = Object.fromEntries(projects.map((project, index) => [
    `/${project.name}/`,
    { changeOrigin: true, target: `http://127.0.0.1:${rendererPort + index + 1}`, ws: true },
  ]));

  return {
    name: "electron-renderer-react",
    config(config) {
      const rendererRoot = resolve(config.root ?? process.cwd());
      const rendererInput = config.build?.rollupOptions?.input;
      emptyRenderer = (
        config.build?.lib === undefined
        && !rendererInput
        && !existsSync(join(rendererRoot, "index.html"))
      );
      managedWrite = config.build?.write;
      const rendererProxy = config.server?.proxy;
      if (rendererProxy && Object.keys(rendererProxy).some(path => path in projectProxy)) {
        throw new Error("React renderer proxy path is already configured by the host");
      }
      return {
        define,
        build: emptyRenderer
          ? {
              rolldownOptions: { input: emptyRendererId },
              write: false,
            }
          : undefined,
        server: { proxy: projectProxy },
      };
    },
    configResolved(config) {
      command = config.command;
      if (!emptyRenderer) managedWrite = config.build.write;
      mode = config.mode;
      rendererOutDir = config.build.outDir;
      rendererPort = config.server.port;
      for (const [index, project] of projects.entries()) {
        projectProxy[`/${project.name}/`].target = `http://127.0.0.1:${rendererPort + index + 1}`;
      }
    },
    resolveId(id) {
      if (id === emptyRendererId) return `\0${emptyRendererId}`;
    },
    load(id) {
      if (id === `\0${emptyRendererId}`) return "export {}";
    },
    async configureServer(rendererServer) {
      for (const [index, project] of projects.entries()) {
        const port = rendererServer.config.server.port + index + 1;
        const server = await createServer({
          base: `/${project.name}/`,
          configFile: project.configFile,
          define,
          mode,
          root: project.root,
          server: {
            host: "127.0.0.1",
            port,
            strictPort: true,
            hmr: { clientPort: rendererServer.config.server.port },
          },
        });
        servers.push(server);
        await server.listen();
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
    },
  };
};
