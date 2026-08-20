import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { normalizePath, type Plugin, type UserConfig } from "vite";

const entryNamePattern = /^[A-Za-z0-9._~-]+$/;

type json_t =
  | null
  | boolean
  | number
  | string
  | readonly json_t[]
  | { readonly [key: string]: json_t };

type ports_t = readonly [
  mainPort: number,
  otherPort: number,
];

export type path_t = `.${string}/index.${"ts" | "tsx"}`;

type paths_t = readonly [path_t, ...path_t[]];

type define_t = Readonly<Record<string, json_t>>;

export type rendererPlugin_t = {
  ports: ports_t;
  paths: paths_t;
  define?: define_t;
};

export type mainPlugin_t = {
  ports: ports_t;
  define?: define_t;
};

export type preloadConfig_t = {
  paths: paths_t;
  define?: define_t;
};

const isEntryName = (name: string): boolean => (
  name !== "."
  && name !== ".."
  && entryNamePattern.test(name)
);

const isIndexEntry = (entry: string): boolean => (
  /^index\.(?:ts|tsx)$/.test(basename(entry))
);

export const defineRead = (define?: define_t): Record<string, string> => Object.fromEntries(
  Object.entries(define ?? {}).map(([name, value]) => {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) throw new Error(`define ${name} cannot be serialized`);
    return [name, serialized];
  }),
);

export const portsRead = (ports: ports_t): ports_t => {
  const [mainPort, otherPort] = ports;
  if (mainPort === otherPort) throw new Error("mainPort and otherPort must be different");
  if (![mainPort, otherPort].every(port => Number.isInteger(port) && port > 0 && port <= 65_535)) {
    throw new Error("Ports must be integers between 1 and 65535");
  }
  return ports;
};

export const packageEntries = (paths: paths_t, target: "Preload" | "React") => {
  const entries = paths.map(path => {
    if (!path.startsWith(".") || isAbsolute(path)) {
      throw new Error(`${target} entry must be relative to process.cwd(): ${path}`);
    }
    const entry = resolve(process.cwd(), path);
    if (!isIndexEntry(entry)) {
      throw new Error(`${target} entry must be an index.ts or index.tsx file: ${entry}`);
    }
    if (!existsSync(entry) || !statSync(entry).isFile()) {
      throw new Error(`${target} entry not found: ${entry}`);
    }
    const root = dirname(entry);
    const packageJsonPath = join(root, "package.json");
    if (!existsSync(packageJsonPath)) {
      throw new Error(`${target} package.json not found: ${packageJsonPath}`);
    }

    const { name } = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { name?: unknown };
    if (typeof name !== "string" || !isEntryName(name)) {
      throw new Error(`${target} package.json name must be one URL or file name segment: ${root}`);
    }
    return { entry, name, root };
  });
  if (new Set(entries.map(({ name }) => name)).size !== entries.length) {
    throw new Error(`${target} package names must be unique`);
  }
  return entries;
};

export const packageProjects = (paths: paths_t) => {
  const projects = packageEntries(paths, "React");
  for (const { root } of projects) {
    const index = join(root, "index.html");
    if (existsSync(index)) throw new Error(`React project must not provide index.html: ${index}`);
  }
  return projects;
};

type ReactProject = ReturnType<typeof packageProjects>[number] & {
  html: string;
};

const htmlSource = (project: ReactProject, development: boolean): string => {
  const relativeEntry = normalizePath(relative(dirname(project.html), project.entry));
  const entry = development
    ? `/@fs/${normalizePath(project.entry)}`
    : relativeEntry.startsWith(".") ? relativeEntry : `./${relativeEntry}`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${entry}"></script>
  </body>
</html>
`;
};

export const renderer = (
  { host, port, proxyTarget, define }: {
    host?: string;
    port: number;
    proxyTarget?: string;
    define?: Record<string, string>;
  },
  inputProjects: ReturnType<typeof packageProjects>,
): Plugin => {
  const cwd = process.cwd();
  const temporaryRoot = resolve(cwd, "node_modules", ".vite", "electron-vite-config-lib");
  rmSync(temporaryRoot, { recursive: true, force: true });

  const projects: ReactProject[] = inputProjects.map(project => ({
    ...project,
    html: join(temporaryRoot, project.name, "index.html"),
  }));
  const publicRoot = join(temporaryRoot, "public");
  let hasPublic = false;
  for (const project of projects) {
    mkdirSync(dirname(project.html), { recursive: true });
    const source = join(project.root, "public");
    if (!existsSync(source) || !statSync(source).isDirectory()) continue;
    cpSync(source, join(publicRoot, project.name), { recursive: true });
    hasPublic = true;
  }

  return {
    name: "electron-react-renderer",
    enforce: "pre",
    config(_config, { command }) {
      for (const project of projects) {
        writeFileSync(project.html, htmlSource(project, command === "serve"), "utf8");
      }
      const common: UserConfig = {
        base: command === "serve" ? "/" : "./",
        define,
        publicDir: hasPublic ? publicRoot : false,
        root: temporaryRoot,
        server: {
          fs: { allow: [cwd, ...projects.map(({ root }) => root)] },
          host,
          port,
          strictPort: true,
          proxy: proxyTarget
            ? { "^/(?!@|node_modules/|__vite_ping|__open-in-editor)": proxyTarget }
            : undefined,
        },
      };
      if (command === "serve") return { ...common, appType: "custom" };

      return {
        ...common,
        build: {
          emptyOutDir: true,
          outDir: resolve(cwd, "out", "renderer"),
          rollupOptions: {
            input: Object.fromEntries(projects.map(({ html, name }) => [name, html])),
          },
        },
      };
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        try {
          if (request.method !== "GET" || !request.url) return next();
          const url = new URL(request.url, "http://electron-renderer.local");
          const project = projects.find(({ name }) => (
            url.pathname === `/${name}` || url.pathname.startsWith(`/${name}/`)
          ));
          if (!project) return next();
          if (url.pathname === `/${project.name}`) {
            response.statusCode = 307;
            response.setHeader("Location", `/${project.name}/${url.search}`);
            response.end();
            return;
          }
          if (!request.headers.accept?.includes("text/html")) return next();
          const html = await server.transformIndexHtml(
            url.pathname,
            readFileSync(project.html, "utf8"),
          );
          response.statusCode = 200;
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.end(html);
        } catch (error) {
          next(error);
        }
      });
    },
  };
};
