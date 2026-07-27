import { existsSync, readFileSync } from "node:fs";
import { basename, isAbsolute, join, resolve } from "node:path";

const entryNamePattern = /^[A-Za-z0-9._~-]+$/;

export const isEntryName = (name: string): boolean => (
  name !== "."
  && name !== ".."
  && entryNamePattern.test(name)
);

export const packageProjects = (...packageRoots: string[]) => {
  if (packageRoots.length === 0) throw new Error("At least one package root is required");
  if (packageRoots.some(isAbsolute)) throw new Error("Package roots must be relative to process.cwd()");

  const projects = packageRoots.map((packageRoot) => {
    const root = resolve(process.cwd(), packageRoot);
    const packageJsonPath = join(root, "package.json");
    if (!existsSync(packageJsonPath)) throw new Error(`Package package.json not found: ${packageJsonPath}`);

    const { name } = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { name?: unknown };
    if (typeof name !== "string" || !isEntryName(name) || basename(root) !== name) {
      throw new Error(`Package directory and name must match one URL or file name segment: ${root}`);
    }
    return { name, root };
  });
  if (new Set(projects.map((project) => project.name)).size !== projects.length) {
    throw new Error("Package names must be unique");
  }
  return projects;
};
