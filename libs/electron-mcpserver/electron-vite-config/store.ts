import { execFile } from "node:child_process";
import { createRequire } from "node:module";
import { readFile, realpath, stat, writeFile } from "node:fs/promises";
import { extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import type { ImmerStateCreator } from "zustand-lib/immerStateCreator";
import { z } from "zod";

const packageName = "electron-vite-config-lib";
const portValidator = z.number().int().min(1).max(65_535);
const portsValidator = z.tuple([portValidator, portValidator]).refine(([a, b]) => a !== b, "ports[0] and ports[1] must be different");
const entryPathValidator = z.string().regex(/^\.\S*\/index\.(?:ts|tsx)$/, "paths must be relative index.ts or index.tsx files");
const entryPathsValidator = z.array(entryPathValidator).min(1);
const rendererNameValidator = z.string().regex(/^[A-Za-z0-9._~-]+$/, "name must be a valid renderer package name");
const defineValidator = z.record(z.string(), z.unknown()).optional();
const packageManifestValidator = z.object({ dependencies: z.record(z.string(), z.unknown()).optional(), devDependencies: z.record(z.string(), z.unknown()).optional() }).passthrough();
const capabilityValidator = z.enum(["mainPlugin", "rendererPlugin", "preloadConfig", "hono", "rendererLoad", "preloadPath"]);
const dependenciesInstallValidator = z.object({ projectPath: z.string().trim().min(1) }).strict();
const importsEnsureValidator = z.object({ projectPath: z.string().trim().min(1), sourceFilePath: z.string().trim().min(1), capabilities: z.array(capabilityValidator).min(1) }).strict();
const mainPluginValidator = z.object({ ports: portsValidator, define: defineValidator });
const rendererPluginValidator = z.object({ ports: portsValidator, paths: entryPathsValidator, define: defineValidator });
const preloadConfigValidator = z.object({ paths: entryPathsValidator, define: defineValidator });
const honoValidator = z.object({ rendererName: rendererNameValidator });
const rendererLoadValidator = z.object({ rendererName: rendererNameValidator, hash: z.string().optional() });
const preloadPathValidator = z.object({ name: rendererNameValidator });
const dependencyPatch = {
  dependencies: { "@hono/node-server": "^1.19.11", [packageName]: "workspace:*", hono: "4.12.30" },
  devDependencies: { "@vitejs/plugin-react": "^5.1.1", electron: "^39.2.6", "electron-vite": "6.0.0-beta.1", vite: "^8.0.11" },
} as const;
const importsByCapability = {
  mainPlugin: [`import mainPlugin from "${packageName}/mainPlugin/plugin";`],
  rendererPlugin: ['import react from "@vitejs/plugin-react";', `import rendererPlugin from "${packageName}/rendererReactPlugin/plugin";`],
  preloadConfig: [`import preloadConfig from "${packageName}/preloadCreate/vite/index";`],
  hono: ['import { Hono } from "hono";', `import { honoServer, honoUrl } from "${packageName}/mainPlugin/hono";`],
  rendererLoad: [`import rendererLoad from "${packageName}/rendererReactPlugin/electron";`],
  preloadPath: [`import preloadPath from "${packageName}/preloadCreate/electron";`],
} as const;
const readmePath = createRequire(import.meta.url).resolve(`${packageName}/README.md`);
const readmeUri = pathToFileURL(readmePath).href;
type ActionResult<T extends object> = { body: T; status?: 400 };
type HonoResult = { packageName: string; import: string[]; server: string; url: string; rendererName: string; next: string };
type MainPluginResult = { packageName: string; import: string; config: { main: { plugins: string[] } }; ports: [number, number]; define?: Record<string, unknown>; next: string };
type PreloadConfigResult = { packageName: string; import: string; config: { preload: string }; paths: string[]; define?: Record<string, unknown>; next: string };
type PreloadPathResult = { packageName: string; import: string; call: string; name: string; next: string };
type RendererLoadResult = { packageName: string; import: string; call: string; rendererName: string; hash?: string; next: string };
type RendererPluginResult = { packageName: string; import: string[]; config: { renderer: { plugins: string[] } }; ports: [number, number]; paths: string[]; define?: Record<string, unknown>; next: string };
const errorMessage = (error: unknown): string => error instanceof Error ? error.message : String(error);
const projectResolve = async (projectPathInput: string): Promise<string> => {
  if (!isAbsolute(projectPathInput)) throw new Error(`projectPath must be absolute: ${projectPathInput}`);
  const projectPath = await realpath(resolve(projectPathInput));
  if (!(await stat(projectPath)).isDirectory()) throw new Error(`projectPath must be a directory: ${projectPath}`);
  try { if ((await stat(join(projectPath, "pnpm-workspace.yaml"))).isFile()) throw new Error(`projectPath must identify a concrete package, not a pnpm workspace root: ${projectPath}`); } catch (error) { if (!(typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === "ENOENT")) throw error; }
  const packageJsonPath = join(projectPath, "package.json");
  if (!(await stat(packageJsonPath)).isFile()) throw new Error(`package.json is required: ${packageJsonPath}`);
  return projectPath;
};
const packageRead = async (packageJsonPath: string) => packageManifestValidator.parse(JSON.parse((await readFile(packageJsonPath, "utf8")).replace(/^\uFEFF/, "")));
const pnpmInstall = async (projectPath: string): Promise<void> => new Promise((resolvePromise, rejectPromise) => {
  const executable = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : "pnpm";
  const args = process.platform === "win32" ? ["/d", "/s", "/c", "pnpm", "install"] : ["install"];
  execFile(executable, args, { cwd: projectPath, encoding: "utf8", maxBuffer: 5 * 1024 * 1024, timeout: 120_000, windowsHide: true }, error => error ? rejectPromise(new Error(`pnpm install failed: ${error.message}`)) : resolvePromise());
});
const sourceInsideProject = (projectPath: string, sourceFilePath: string): boolean => { const value = relative(projectPath, sourceFilePath); return value.length > 0 && value !== ".." && !value.startsWith(`..${sep}`) && !isAbsolute(value); };
const importsEnsure = async (sourceFilePath: string, statements: readonly string[]): Promise<string[]> => {
  const original = await readFile(sourceFilePath, "utf8");
  const missing = [...new Set(statements)].filter(statement => !original.includes(statement));
  if (!missing.length) return [];
  const bom = original.startsWith("\uFEFF") ? "\uFEFF" : "";
  const source = bom ? original.slice(1) : original;
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const shebangEnd = source.startsWith("#!") ? source.indexOf("\n") + 1 : 0;
  await writeFile(sourceFilePath, `${bom}${source.slice(0, shebangEnd)}${missing.join(newline)}${newline}${source.slice(shebangEnd)}`, "utf8");
  return missing;
};

type ElectronViteConfigSlice = {
  electronViteConfigActions: {
    dependenciesInstall(input: z.output<typeof dependenciesInstallValidator>): Promise<ActionResult<Record<string, unknown>>>;
    hono(input: z.output<typeof honoValidator>): HonoResult;
    importsEnsure(input: z.output<typeof importsEnsureValidator>): Promise<ActionResult<Record<string, unknown>>>;
    mainPlugin(input: z.output<typeof mainPluginValidator>): MainPluginResult;
    preloadConfig(input: z.output<typeof preloadConfigValidator>): PreloadConfigResult;
    preloadPath(input: z.output<typeof preloadPathValidator>): PreloadPathResult;
    readme(uri?: string): Promise<{ contents: Array<{ uri: string; mimeType: string; text: string }> }>;
    rendererLoad(input: z.output<typeof rendererLoadValidator>): RendererLoadResult;
    rendererPlugin(input: z.output<typeof rendererPluginValidator>): RendererPluginResult;
  };
};

const s: ImmerStateCreator<ElectronViteConfigSlice> = () => ({
  electronViteConfigActions: {
    async dependenciesInstall(input) {
      try {
        const projectPath = await projectResolve(dependenciesInstallValidator.parse(input).projectPath);
        const packageJsonPath = join(projectPath, "package.json");
        const packageJson = await packageRead(packageJsonPath);
        const next = { ...packageJson, dependencies: { ...(packageJson.dependencies ?? {}), ...dependencyPatch.dependencies }, devDependencies: { ...(packageJson.devDependencies ?? {}), ...dependencyPatch.devDependencies } };
        const changed = JSON.stringify(next) !== JSON.stringify(packageJson);
        if (changed) await writeFile(packageJsonPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
        await pnpmInstall(projectPath);
        return { body: { changed, installed: dependencyPatch, packageJsonPath, projectPath } };
      } catch (error) { return { body: { error: errorMessage(error) }, status: 400 }; }
    },
    hono(input) { const { rendererName } = honoValidator.parse(input); return { packageName, import: ['import { Hono } from "hono";', `import { honoServer, honoUrl } from "${packageName}/mainPlugin/hono";`], server: "const server = honoServer(new Hono().get(\"/health\", context => context.json({ ok: true })));", url: `honoUrl(${JSON.stringify(rendererName)})`, rendererName, next: "Use the same ports passed to mainPlugin and rendererPlugin; read electron.readme before changing runtime code." }; },
    async importsEnsure(input) {
      try {
        const value = importsEnsureValidator.parse(input);
        const projectPath = await projectResolve(value.projectPath);
        if (!isAbsolute(value.sourceFilePath)) throw new Error(`sourceFilePath must be absolute: ${value.sourceFilePath}`);
        const sourceFilePath = await realpath(resolve(value.sourceFilePath));
        if (!sourceInsideProject(projectPath, sourceFilePath)) throw new Error(`sourceFilePath must resolve inside projectPath: ${sourceFilePath}`);
        if (!(await stat(sourceFilePath)).isFile() || ![".ts", ".tsx"].includes(extname(sourceFilePath).toLowerCase())) throw new Error(`sourceFilePath must be an existing .ts or .tsx file: ${sourceFilePath}`);
        if (sourceFilePath.toLowerCase().endsWith(".d.ts")) throw new Error(`Declaration files are not supported: ${sourceFilePath}`);
        return { body: { added: await importsEnsure(sourceFilePath, value.capabilities.flatMap(capability => importsByCapability[capability])), capabilities: value.capabilities, projectPath, sourceFilePath } };
      } catch (error) { return { body: { error: errorMessage(error) }, status: 400 }; }
    },
    mainPlugin(input) { const value = mainPluginValidator.parse(input); const call = `mainPlugin({ ports: ${JSON.stringify(value.ports)}${value.define ? ", define" : ""} })`; return { packageName, import: `import mainPlugin from "${packageName}/mainPlugin/plugin";`, config: { main: { plugins: [call] } }, ports: value.ports, ...(value.define ? { define: value.define } : {}), next: "Read the electron.readme resource before editing the generated config." }; },
    preloadConfig(input) { const value = preloadConfigValidator.parse(input); const call = `preloadConfig({ paths: ${JSON.stringify(value.paths)}${value.define ? ", define" : ""} })`; return { packageName, import: `import preloadConfig from "${packageName}/preloadCreate/vite/index";`, config: { preload: call }, paths: value.paths, ...(value.define ? { define: value.define } : {}), next: "Read the electron.readme resource before editing the generated config." }; },
    preloadPath(input) { const { name } = preloadPathValidator.parse(input); return { packageName, import: `import preloadPath from "${packageName}/preloadCreate/electron";`, call: `preload: preloadPath(${JSON.stringify(name)})`, name, next: "Do not concatenate out/preload paths manually; read electron.readme for the paired preloadConfig contract." }; },
    async readme(uri) { return { contents: [{ uri: uri ?? readmeUri, mimeType: "text/markdown", text: await readFile(readmePath, "utf8") }] }; },
    rendererLoad(input) { const value = rendererLoadValidator.parse(input); return { packageName, import: `import rendererLoad from "${packageName}/rendererReactPlugin/electron";`, call: `await rendererLoad({ webContents: window.webContents, name: ${JSON.stringify(value.rendererName)}${value.hash === undefined ? "" : `, hash: ${JSON.stringify(value.hash)}`} });`, rendererName: value.rendererName, ...(value.hash === undefined ? {} : { hash: value.hash }), next: "Do not branch on app.isPackaged or manually compose development and production URLs." }; },
    rendererPlugin(input) { const value = rendererPluginValidator.parse(input); const call = `rendererPlugin({ ports: ${JSON.stringify(value.ports)}, paths: ${JSON.stringify(value.paths)}${value.define ? ", define" : ""} })`; return { packageName, import: ['import react from "@vitejs/plugin-react";', `import rendererPlugin from "${packageName}/rendererReactPlugin/plugin";`], config: { renderer: { plugins: ["react()", call] } }, ports: value.ports, paths: value.paths, ...(value.define ? { define: value.define } : {}), next: "Read the electron.readme resource before editing the generated config." }; },
  },
});

export default s;
export { dependenciesInstallValidator, honoValidator, importsEnsureValidator, mainPluginValidator, preloadConfigValidator, preloadPathValidator, readmeUri, rendererLoadValidator, rendererPluginValidator };
