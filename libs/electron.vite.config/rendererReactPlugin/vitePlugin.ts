import react from "@vitejs/plugin-react";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import {
  build,
  createServer,
  type Plugin,
  type UserConfig,
  type ViteDevServer,
} from "vite";
import { isEntryName } from "../public.ts";

export default (
  {
    renderPort,
    webDefine,
  }: {
    renderPort: number;
    webDefine?: UserConfig["define"];
  },
  ...rendererEntryGroups: Record<string, string>[]
): Plugin => {
  const rendererEntries = Object.entries(
    Object.assign({} as Record<string, string>, ...rendererEntryGroups),
  ) as [string, string][];
  const rendererEntryCount = rendererEntryGroups.reduce(
    (count, entries) => count + Object.keys(entries).length,
    0,
  );
  if (rendererEntries.length !== rendererEntryCount) {
    throw new Error("React renderer entry names must be unique");
  }
  const projects = rendererEntries.map(([name, entry]) => {
    if (!isEntryName(name)) throw new Error(`Invalid React renderer entry name: ${name}`);
    if (!existsSync(entry)) throw new Error(`React renderer entry not found: ${entry}`);
    return { entry, name, root: dirname(entry) };
  });

  const servers: ViteDevServer[] = [];
  const emptyRendererId = "virtual:electron-renderer";
  let command: "build" | "serve";
  let emptyRenderer = false;
  let managedWrite: boolean | undefined;
  let mode: string;
  let rendererOutDir: string;
  let rendererPort = renderPort;
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
        define: webDefine,
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
          configFile: false,
          define: webDefine,
          mode,
          plugins: [react()],
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
              rollupOptions: { input: project.entry },
              write: managedWrite,
            },
            configFile: false,
            define: webDefine,
            mode,
            plugins: [react()],
            root: project.root,
          });
        }
        return;
      }
      await Promise.allSettled(servers.splice(0).map(server => server.close()));
    },
  };
};
