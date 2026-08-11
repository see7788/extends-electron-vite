import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";

const entryNamePattern = /^[A-Za-z0-9._~-]+$/;

export type json_t =
  | null
  | boolean
  | number
  | string
  | readonly json_t[]
  | { readonly [key: string]: json_t };

export type ports_t = readonly [
  mainPort: number,
  otherPort: number,
];

export type path_t = `.${string}`;

export type paths_t = readonly path_t[];

export type rendererPath_t = `${path_t}/index.tsx`;

export type rendererPaths_t = readonly rendererPath_t[];

export type define_t = Readonly<Record<string, json_t>>;

export type rendererPlugin_t = {
  ports: ports_t;
  paths: rendererPaths_t;
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

export const isEntryName = (name: string): boolean => (
  name !== "."
  && name !== ".."
  && entryNamePattern.test(name)
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

export const packageProjects = (paths: rendererPaths_t) => {
  if (paths.length === 0) throw new Error("At least one React project is required");
  const projects = paths.map(path => {
    if (isAbsolute(path)) throw new Error(`React entry must be relative to process.cwd(): ${path}`);
    const entry = resolve(process.cwd(), path);
    if (!existsSync(entry) || !statSync(entry).isFile()) {
      throw new Error(`React entry not found: ${entry}`);
    }
    const root = dirname(entry);
    const packageJsonPath = join(root, "package.json");
    if (!existsSync(packageJsonPath)) throw new Error(`Package package.json not found: ${packageJsonPath}`);
    const index = join(root, "index.html");
    if (existsSync(index)) throw new Error(`React project must not provide index.html: ${index}`);

    const { name } = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { name?: unknown };
    if (typeof name !== "string" || !isEntryName(name)) {
      throw new Error(`package.json name must be one URL or file name segment: ${root}`);
    }
    return { entry, index, name, root };
  });
  if (new Set(projects.map((project) => project.name)).size !== projects.length) {
    throw new Error("Package names must be unique");
  }
  return projects;
};
