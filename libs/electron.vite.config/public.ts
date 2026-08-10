import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";

const entryNamePattern = /^[A-Za-z0-9._~-]+$/;
export type reactPkg_t= [path: `../${string}`, define?: Record<string, unknown>]
export const isEntryName = (name: string): boolean => (
  name !== "."
  && name !== ".."
  && entryNamePattern.test(name)
);

const projectDefine = (define?: Record<string, unknown>) => Object.fromEntries(
  Object.entries(define ?? {}).map(([name, value]) => {
    if (typeof value === "string") return [name, value];
    const serialized = JSON.stringify(value);
    if (serialized === undefined) throw new Error(`define ${name} cannot be serialized`);
    return [name, serialized];
  }),
);

export const packageProjects = (
  ...reactPkg:reactPkg_t[]
) => {
  if (reactPkg.length === 0) throw new Error("At least one React project is required");
  if (reactPkg.some(([path]) => isAbsolute(path))) {
    throw new Error("React paths must be relative to process.cwd()");
  }

  const projects = reactPkg.map(([path, define]) => {
    const root = resolve(process.cwd(), path);
    const packageJsonPath = join(root, "package.json");
    if (!existsSync(packageJsonPath)) throw new Error(`Package package.json not found: ${packageJsonPath}`);
    const index = join(root, "index.html");
    if (!existsSync(index)) throw new Error(`React index.html not found: ${index}`);

    const { name } = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { name?: unknown };
    if (typeof name !== "string" || !isEntryName(name)) {
      throw new Error(`package.json name must be one URL or file name segment: ${root}`);
    }
    return { define: projectDefine(define), index, name, root };
  });
  if (new Set(projects.map((project) => project.name)).size !== projects.length) {
    throw new Error("Package names must be unique");
  }
  return projects;
};
