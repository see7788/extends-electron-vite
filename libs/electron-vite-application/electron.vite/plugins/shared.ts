import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";

// Shared validation and entry helpers for this scaffold.

export type JsonValue = null | boolean | number | string | readonly JsonValue[] | { readonly [key: string]: JsonValue };
export type Path = `.${string}/index.${"ts" | "tsx"}`;
export type Paths = readonly [Path, ...Path[]];
export type Define = Readonly<Record<string, JsonValue>>;
export type Ports = readonly [mainPort: number, otherPort: number];
export type MainPluginOptions = { ports: Ports; define?: Define };
export type PreloadConfigOptions = { paths: Paths; define?: Define };
export type RendererPluginOptions = { ports: Ports; paths: Paths; define?: Define };

export const defineRead = (define?: Define): Record<string, string> => Object.fromEntries(
  Object.entries(define ?? {}).map(([name, value]) => {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) throw new Error(`define ${name} cannot be serialized`);
    return [name, serialized];
  }),
);
export const portsRead = (ports: Ports): Ports => {
  const [mainPort, otherPort] = ports;
  if (mainPort === otherPort) throw new Error("mainPort and otherPort must be different");
  if (![mainPort, otherPort].every(port => Number.isInteger(port) && port > 0 && port <= 65_535)) throw new Error("Ports must be integers between 1 and 65535");
  return ports;
};
const entryNamePattern = /^[A-Za-z0-9._~-]+$/;
const isIndexEntry = (entry: string): boolean => /^index\.(?:ts|tsx)$/.test(entry.split(/[\\/]/u).at(-1) ?? "");
export const packageEntries = (paths: Paths, target: "Preload" | "React") => {
  const entries = paths.map(path => {
    if (!path.startsWith(".") || isAbsolute(path)) throw new Error(`${target} entry must be relative: ${path}`);
    const entry = resolve(process.cwd(), path);
    if (!isIndexEntry(entry)) throw new Error(`${target} entry must be an index.ts or index.tsx file: ${entry}`);
    if (!existsSync(entry)) throw new Error(`${target} entry not found: ${entry}`);
    const root = dirname(entry);
    const packageJsonPath = join(root, "package.json");
    const name = existsSync(packageJsonPath)
      ? (JSON.parse(readFileSync(packageJsonPath, "utf8")) as { name?: unknown }).name
      : basename(root);
    if (typeof name !== "string" || !entryNamePattern.test(name)) throw new Error(`${target} package name is invalid: ${root}`);
    return { entry, name, root };
  });
  if (new Set(entries.map(({ name }) => name)).size !== entries.length) throw new Error(`${target} package names must be unique`);
  return entries;
};
export const packageProjects = (paths: Paths) => {
  const projects = packageEntries(paths, "React");
  for (const { root } of projects) if (existsSync(join(root, "index.html"))) throw new Error(`React project must not provide index.html: ${join(root, "index.html")}`);
  return projects;
};
