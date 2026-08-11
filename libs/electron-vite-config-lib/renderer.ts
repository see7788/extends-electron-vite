import { existsSync, rmSync, statSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { build, mergeConfig, normalizePath, type Plugin, type PluginOption, type UserConfig } from "vite";
import { packageProjects } from "./public.ts";

type ReactProject = ReturnType<typeof packageProjects>[number];

export default function renderer(
  { host, port, proxyTarget, define }: {
    host?: string;
    port: number;
    proxyTarget?: string;
    define?: Record<string, string>;
  },
  projects: ReactProject[],
): Plugin {
  if (projects.length === 0) {
    throw new Error("renderer requires at least one React project");
  }

  const htmlSource = (project: ReactProject, entry: string): string =>
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${project.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${entry}"></script>
  </body>
</html>
`;

  const htmlCreate = (project: ReactProject): void => {
    if (existsSync(project.index)) {
      throw new Error(
        `renderer temporary HTML already exists: ${project.index}`,
      );
    }

    writeFileSync(project.index, htmlSource(project, "/index.tsx"), {
      encoding: "utf8",
      flag: "wx",
    });
  };

  const htmlRemove = (project: ReactProject): void => {
    rmSync(project.index, { force: true });
  };

  const projectConfig = (project: ReactProject): UserConfig => ({
    base: "./",
    root: project.root,
    define,
    build: {
      emptyOutDir: true,
      outDir: resolve("out", "renderer", project.name),
      rollupOptions: { input: project.index },
    },
  });

  const options: { plugins?: PluginOption[] } = {};
  const config: UserConfig = {};
  let primaryHtmlCreated = false;
  const plugin: Plugin = {
    name: "electron-react-renderer",
    config(userConfig, { command }) {
      const withoutSelf = (candidate: PluginOption): PluginOption => {
        if (Array.isArray(candidate)) {
          return candidate.map(withoutSelf);
        }
        if (candidate instanceof Promise) {
          return candidate.then(withoutSelf);
        }
        return candidate && candidate.name === plugin.name ? false : candidate;
      };
      options.plugins = userConfig.plugins?.map(withoutSelf);
      Object.assign(config, userConfig, { plugins: undefined });

      const common: UserConfig = {
        base: "./",
        define,
        server: {
          fs: { allow: projects.map(({ root }) => root) },
          host,
          port,
          strictPort: true,
          proxy: proxyTarget
            ? {
                "^/(?!@|node_modules/|__vite_ping|__open-in-editor)":
                  proxyTarget,
              }
            : undefined,
        },
      };

      if (command === "serve") {
        for (const project of projects) {
          if (existsSync(project.index)) {
            throw new Error(
              `renderer temporary HTML already exists: ${project.index}`,
            );
          }
        }
        return { ...common, appType: "custom" };
      }

      const primary = projects[0];
      const primaryConfig = mergeConfig(common, projectConfig(primary));
      htmlCreate(primary);
      primaryHtmlCreated = true;
      return primaryConfig;
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        try {
          const requestUrl = new URL(
            request.url ?? "/",
            "http://electron-renderer.local",
          );
          const project = projects.find(
            ({ name }) =>
              requestUrl.pathname === `/${name}` ||
              requestUrl.pathname.startsWith(`/${name}/`),
          );

          if (!project) {
            next();
            return;
          }

          if (requestUrl.pathname === `/${project.name}`) {
            response.statusCode = 307;
            response.setHeader(
              "Location",
              `/${project.name}/${requestUrl.search}`,
            );
            response.end();
            return;
          }

          const projectPath = requestUrl.pathname.slice(
            project.name.length + 1,
          );
          const requestedFile =
            projectPath === "/index.tsx"
              ? resolve(project.entry)
              : join(project.root, projectPath);
          const publicRoot = join(project.root, "public");
          const publicFile = join(publicRoot, projectPath);
          const projectRelativePath = normalizePath(
            relative(project.root, requestedFile),
          );
          const publicRelativePath = normalizePath(
            relative(publicRoot, publicFile),
          );
          const isInsideProject =
            !isAbsolute(projectRelativePath) &&
            projectRelativePath !== ".." &&
            !projectRelativePath.startsWith("../");
          const isInsidePublic =
            !isAbsolute(publicRelativePath) &&
            publicRelativePath !== ".." &&
            !publicRelativePath.startsWith("../");
          const staticFile =
            isInsideProject &&
            existsSync(requestedFile) &&
            statSync(requestedFile).isFile()
              ? requestedFile
              : isInsidePublic &&
                  existsSync(publicFile) &&
                  statSync(publicFile).isFile()
                ? publicFile
                : undefined;

          if (staticFile) {
            const relativePath = normalizePath(
              relative(server.config.root, staticFile),
            );
            request.url = `${
              relativePath === ".." || relativePath.startsWith("../")
                ? `/@fs/${normalizePath(staticFile)}`
                : `/${relativePath}`
            }${requestUrl.search}`;
            next();
            return;
          }

          if (
            request.method !== "GET" ||
            !request.headers.accept?.includes("text/html")
          ) {
            next();
            return;
          }

          const url = request.url ?? requestUrl.pathname;
          const html = await server.transformIndexHtml(
            url,
            htmlSource(project, `/${project.name}/index.tsx`),
            request.originalUrl,
          );
          response.statusCode = 200;
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.end(html);
        } catch (error) {
          next(error as Error);
        }
      });
    },
    buildEnd() {
      if (primaryHtmlCreated) {
        htmlRemove(projects[0]);
      }
    },
    async closeBundle() {
      try {
        for (const project of projects.slice(1)) {
          htmlCreate(project);
          try {
            await build({
              ...mergeConfig(config, projectConfig(project)),
              configFile: false,
              plugins: options.plugins,
            });
          } finally {
            htmlRemove(project);
          }
        }
      } finally {
        if (primaryHtmlCreated) {
          htmlRemove(projects[0]);
          primaryHtmlCreated = false;
        }
      }
    },
  };

  return plugin;
}
