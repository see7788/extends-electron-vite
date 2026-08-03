import { existsSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import {
  build,
  mergeConfig,
  normalizePath,
  transformWithOxc,
  type Plugin,
  type PluginOption,
  type UserConfig,
} from "vite";
import { packageProjects } from "./public.ts";

type ReactProject = ReturnType<typeof packageProjects>[number];

export default function renderer(
  {
    host,
    port,
    proxyTarget,
  }: {
    host?: string;
    port: number;
    proxyTarget?: string;
  },
  projects: ReactProject[],
): Plugin {
  const cwd = process.cwd();
  const [primaryProject, ...secondaryProjects] = projects;
  let command: "build" | "serve";
  let sharedConfig: UserConfig = {};
  let buildPlugins: PluginOption[] = [];
  let buildCompleting = false;

  const projectBuild = (project: ReactProject) => build(mergeConfig(sharedConfig, {
    base: "./",
    build: {
      emptyOutDir: true,
      outDir: resolve(cwd, "out", "renderer", project.name),
      rolldownOptions: { input: project.index },
    },
    configFile: false,
    define: project.define,
    plugins: buildPlugins,
    root: project.root,
  }));

  const plugin: Plugin = {
    name: "electron-react-renderer",
    enforce: "pre",
    config(config, configEnv) {
      command = configEnv.command;
      const { plugins = [], ...configWithoutPlugins } = config;
      sharedConfig = configWithoutPlugins;
      buildPlugins = plugins.map(option => (
        option
        && !Array.isArray(option)
        && typeof option === "object"
        && "name" in option
        && option.name === plugin.name
          ? false
          : option
      ));
      if (configEnv.command === "serve") {
        return {
          appType: "custom",
          build: {
            rolldownOptions: { input: primaryProject.index },
          },
          root: cwd,
          server: {
            fs: { allow: projects.map(project => project.root) },
            host,
            port,
            proxy: proxyTarget
              ? {
                  "^/(?!@|node_modules/|__vite_ping|__open-in-editor)": {
                    target: proxyTarget,
                  },
                }
              : undefined,
            strictPort: true,
          },
        };
      }
      return {
        base: "./",
        build: {
          emptyOutDir: true,
          outDir: resolve(cwd, "out", "renderer", primaryProject.name),
          rolldownOptions: { input: primaryProject.index },
        },
        define: primaryProject.define,
        root: primaryProject.root,
      };
    },
    async transform(code, id) {
      if (command !== "serve") return;
      const file = normalizePath(id.split("?")[0]);
      const project = projects.find(({ root }) => {
        const projectRoot = normalizePath(root);
        return file === projectRoot || file.startsWith(`${projectRoot}/`);
      });
      if (!project || !/\.[cm]?[jt]sx?$/.test(file)) return;
      const result = await transformWithOxc(code, file, {
        define: project.define,
        jsx: "preserve",
        sourcemap: true,
        target: "esnext",
      });
      return { code: result.code, map: result.map };
    },
    resolveId(id) {
      if (command !== "serve" || !id.startsWith("/")) return;
      const [pathname, query] = id.split("?", 2);
      const project = projects.find(({ name }) => pathname.startsWith(`/${name}/`));
      if (!project) return;
      const file = resolve(
        project.root,
        decodeURIComponent(pathname.slice(project.name.length + 2)),
      );
      if (
        relative(project.root, file).split(/[\\/]/).includes("..")
        || !existsSync(file)
        || !statSync(file).isFile()
      ) {
        return;
      }
      return `${normalizePath(file)}${query ? `?${query}` : ""}`;
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        try {
          if (!request.url || request.method !== "GET") return next();
          const requestUrl = new URL(request.url, "http://localhost");
          const project = projects.find(({ name }) => (
            requestUrl.pathname === `/${name}` || requestUrl.pathname.startsWith(`/${name}/`)
          ));
          if (!project) return next();
          if (requestUrl.pathname === `/${project.name}`) {
            response.statusCode = 307;
            response.setHeader("Location", `/${project.name}/${requestUrl.search}`);
            response.end();
            return;
          }

          const projectPath = decodeURIComponent(
            requestUrl.pathname.slice(project.name.length + 2),
          );
          for (const root of [project.root, join(project.root, "public")]) {
            const file = resolve(root, projectPath);
            if (
              relative(root, file).split(/[\\/]/).includes("..")
              || !existsSync(file)
              || !statSync(file).isFile()
            ) {
              continue;
            }
            request.url = `/@fs/${normalizePath(file)}${requestUrl.search}`;
            return next();
          }

          if (
            projectPath !== ""
            && !request.headers.accept?.includes("text/html")
          ) {
            return next();
          }
          const source = readFileSync(project.index, "utf8").replace(
            /(\b(?:src|href)=["'])\/(?!\/)/g,
            `$1/${project.name}/`,
          );
          const html = await server.transformIndexHtml(requestUrl.pathname, source);
          response.statusCode = 200;
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.end(html);
        } catch (error) {
          next(error);
        }
      });
    },
    async closeBundle() {
      if (command !== "build" || buildCompleting) return;
      buildCompleting = true;
      for (const project of secondaryProjects) await projectBuild(project);
    },
  };

  return plugin;
}
