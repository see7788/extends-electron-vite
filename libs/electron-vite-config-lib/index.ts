import { execFile } from "node:child_process";
import { readFile, realpath, stat, writeFile } from "node:fs/promises";
import { extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const portValidator = z.number().int().min(1).max(65_535);
const portsValidator = z.tuple([portValidator, portValidator])
  .refine(([mainPort, rendererPort]) => mainPort !== rendererPort,
    "ports[0] 与 ports[1] 不能相同");
const entryPathValidator = z.string().regex(
  /^\.\S*\/index\.(?:ts|tsx)$/,
  "paths 必须是相对的 index.ts 或 index.tsx 文件路径",
);
const entryPathsValidator = z.array(entryPathValidator).min(1);
const rendererNameValidator = z.string().regex(
  /^[A-Za-z0-9._~-]+$/,
  "name 必须是有效的 renderer 包名",
);
const defineValidator = z.record(z.string(), z.unknown()).optional();
const capabilityValidator = z.enum([
  "mainPlugin", "rendererPlugin", "preloadConfig",
  "hono", "rendererLoad", "preloadPath",
]);

export const dependenciesInstallValidator = z.object({
  projectPath: z.string().trim().min(1),
}).strict();
export const importsEnsureValidator = z.object({
  projectPath: z.string().trim().min(1),
  sourceFilePath: z.string().trim().min(1),
  capabilities: z.array(capabilityValidator).min(1),
}).strict();
export const mainPluginValidator = z.object({
  ports: portsValidator,
  define: defineValidator,
}).strict();
export const rendererPluginValidator = z.object({
  ports: portsValidator,
  paths: entryPathsValidator,
  define: defineValidator,
}).strict();
export const preloadConfigValidator = z.object({
  paths: entryPathsValidator,
  define: defineValidator,
}).strict();
export const honoValidator = z.object({
  rendererName: rendererNameValidator,
}).strict();
export const rendererLoadValidator = z.object({
  rendererName: rendererNameValidator,
  hash: z.string().optional(),
}).strict();
export const preloadPathValidator = z.object({
  name: rendererNameValidator,
}).strict();

const packageManifestValidator = z.object({
  dependencies: z.record(z.string(), z.unknown()).optional(),
  devDependencies: z.record(z.string(), z.unknown()).optional(),
}).passthrough();
const packageName = "electron-vite-config-lib";
const dependencyPatch = {
  dependencies: {
    "@hono/node-server": "^1.19.11",
    [packageName]: "workspace:*",
    hono: "4.12.30",
  },
  devDependencies: {
    "@vitejs/plugin-react": "^5.1.1",
    electron: "^39.2.6",
    "electron-vite": "6.0.0-beta.1",
    vite: "^8.0.11",
  },
} as const;
const importsByCapability = {
  mainPlugin: ["import mainPlugin from \"" + packageName + "/mainPlugin/plugin\";"],
  rendererPlugin: [
    "import react from \"@vitejs/plugin-react\";",
    "import rendererPlugin from \"" + packageName + "/rendererReactPlugin/plugin\";",
  ],
  preloadConfig: [
    "import preloadConfig from \"" + packageName + "/preloadCreate/vite/index\";",
  ],
  hono: [
    "import { Hono } from \"hono\";",
    "import { honoServer, honoUrl } from \"" + packageName + "/mainPlugin/hono\";",
  ],
  rendererLoad: [
    "import rendererLoad from \"" + packageName + "/rendererReactPlugin/electron\";",
  ],
  preloadPath: [
    "import preloadPath from \"" + packageName + "/preloadCreate/electron\";",
  ],
} as const;
const readmeUrl = new URL("./README.md", import.meta.url);
export const readmeUri = readmeUrl.href;
const readmePath = fileURLToPath(readmeUrl);

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);
const projectResolve = async (projectPathInput: string): Promise<string> => {
  if (!isAbsolute(projectPathInput)) {
    throw new Error("projectPath 必须是绝对路径：" + projectPathInput);
  }
  const projectPath = await realpath(resolve(projectPathInput));
  if (!(await stat(projectPath)).isDirectory()) {
    throw new Error("projectPath 必须指向目录：" + projectPath);
  }
  try {
    if ((await stat(join(projectPath, "pnpm-workspace.yaml"))).isFile()) {
      throw new Error(
        "projectPath 必须指向具体包，不能指向 pnpm workspace 根：" + projectPath,
      );
    }
  } catch (error) {
    if (!(typeof error === "object" && error !== null && "code" in error
      && (error as { code?: unknown }).code === "ENOENT")) throw error;
  }
  const packageJsonPath = join(projectPath, "package.json");
  if (!(await stat(packageJsonPath)).isFile()) {
    throw new Error("package.json is required: " + packageJsonPath);
  }
  return projectPath;
};
const packageRead = async (packageJsonPath: string) =>
  packageManifestValidator.parse(
    JSON.parse((await readFile(packageJsonPath, "utf8")).replace(/^\uFEFF/, "")),
  );
const pnpmInstall = async (projectPath: string): Promise<void> =>
  new Promise((resolvePromise, rejectPromise) => {
    const executable = process.platform === "win32"
      ? (process.env.ComSpec ?? "cmd.exe") : "pnpm";
    const args = process.platform === "win32"
      ? ["/d", "/s", "/c", "pnpm", "install"] : ["install"];
    execFile(executable, args, {
      cwd: projectPath, encoding: "utf8", maxBuffer: 5 * 1024 * 1024,
      timeout: 120_000, windowsHide: true,
    }, error => error
      ? rejectPromise(new Error("pnpm install failed: " + error.message))
      : resolvePromise());
  });
const sourceInsideProject = (projectPath: string, sourceFilePath: string) => {
  const value = relative(projectPath, sourceFilePath);
  return value.length > 0 && value !== ".."
    && !value.startsWith(".." + sep) && !isAbsolute(value);
};
const ensureImports = async (
  sourceFilePath: string,
  statements: readonly string[],
): Promise<string[]> => {
  const original = await readFile(sourceFilePath, "utf8");
  const missing = [...new Set(statements)]
    .filter(statement => !original.includes(statement));
  if (!missing.length) return [];
  const bom = original.startsWith("\uFEFF") ? "\uFEFF" : "";
  const source = bom ? original.slice(1) : original;
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const shebangEnd = source.startsWith("#!") ? source.indexOf("\n") + 1 : 0;
  await writeFile(
    sourceFilePath,
    bom + source.slice(0, shebangEnd) + missing.join(newline)
      + newline + source.slice(shebangEnd),
    "utf8",
  );
  return missing;
};

class ElectronViteConfig {
  async readme(uri?: string): Promise<{
    contents: Array<{ uri: string; mimeType: string; text: string }>;
  }> {
    return {
      contents: [{
        uri: uri ?? readmeUri,
        mimeType: "text/markdown",
        text: await readFile(readmePath, "utf8"),
      }],
    };
  }
  async dependenciesInstall(
    input: z.output<typeof dependenciesInstallValidator>,
  ) {
    try {
      const value = dependenciesInstallValidator.parse(input);
      const projectPath = await projectResolve(value.projectPath);
      const packageJsonPath = join(projectPath, "package.json");
      const packageJson = await packageRead(packageJsonPath);
      const next = {
        ...packageJson,
        dependencies: {
          ...(packageJson.dependencies ?? {}),
          ...dependencyPatch.dependencies,
        },
        devDependencies: {
          ...(packageJson.devDependencies ?? {}),
          ...dependencyPatch.devDependencies,
        },
      };
      const changed = JSON.stringify(next) !== JSON.stringify(packageJson);
      if (changed) {
        await writeFile(
          packageJsonPath,
          JSON.stringify(next, null, 2) + "\n",
          "utf8",
        );
      }
      await pnpmInstall(projectPath);
      return {
        body: { changed, installed: dependencyPatch, packageJsonPath, projectPath },
      };
    } catch (error) {
      return { body: { error: errorMessage(error) }, status: 400 as const };
    }
  }
  async importsEnsure(
    input: z.output<typeof importsEnsureValidator>,
  ) {
    try {
      const value = importsEnsureValidator.parse(input);
      const projectPath = await projectResolve(value.projectPath);
      if (!isAbsolute(value.sourceFilePath)) {
        throw new Error("sourceFilePath 必须是绝对路径：" + value.sourceFilePath);
      }
      const sourceFilePath = await realpath(resolve(value.sourceFilePath));
      if (!sourceInsideProject(projectPath, sourceFilePath)) {
        throw new Error(
          "sourceFilePath 必须位于 projectPath 内部：" + sourceFilePath,
        );
      }
      if (
        !(await stat(sourceFilePath)).isFile()
        || ![".ts", ".tsx"].includes(extname(sourceFilePath).toLowerCase())
      ) {
        throw new Error(
          "sourceFilePath 必须指向已经存在的 .ts 或 .tsx 文件：" + sourceFilePath,
        );
      }
      if (sourceFilePath.toLowerCase().endsWith(".d.ts")) {
        throw new Error("不支持修改声明文件：" + sourceFilePath);
      }
      return {
        body: {
          added: await ensureImports(
            sourceFilePath,
            value.capabilities.flatMap(
              capability => importsByCapability[capability],
            ),
          ),
          capabilities: value.capabilities,
          projectPath,
          sourceFilePath,
        },
      };
    } catch (error) {
      return { body: { error: errorMessage(error) }, status: 400 as const };
    }
  }
  mainPlugin(input: z.output<typeof mainPluginValidator>) {
    const value = mainPluginValidator.parse(input);
    const call = "mainPlugin({ ports: " + JSON.stringify(value.ports)
      + (value.define ? ", define" : "") + " })";
    return {
      packageName,
      import: "import mainPlugin from \"" + packageName
        + "/mainPlugin/plugin\";",
      config: { main: { plugins: [call] } },
      ports: value.ports,
      ...(value.define ? { define: value.define } : {}),
      next: "修改生成的配置前，请先读取 electron.readme 资源。",
    };
  }
  rendererPlugin(input: z.output<typeof rendererPluginValidator>) {
    const value = rendererPluginValidator.parse(input);
    const call = "rendererPlugin({ ports: " + JSON.stringify(value.ports)
      + ", paths: " + JSON.stringify(value.paths)
      + (value.define ? ", define" : "") + " })";
    return {
      packageName,
      import: [
        "import react from \"@vitejs/plugin-react\";",
        "import rendererPlugin from \"" + packageName
          + "/rendererReactPlugin/plugin\";",
      ],
      config: { renderer: { plugins: ["react()", call] } },
      ports: value.ports,
      paths: value.paths,
      ...(value.define ? { define: value.define } : {}),
      next: "修改生成的配置前，请先读取 electron.readme 资源。",
    };
  }
  preloadConfig(input: z.output<typeof preloadConfigValidator>) {
    const value = preloadConfigValidator.parse(input);
    const call = "preloadConfig({ paths: " + JSON.stringify(value.paths)
      + (value.define ? ", define" : "") + " })";
    return {
      packageName,
      import: "import preloadConfig from \"" + packageName
        + "/preloadCreate/vite/index\";",
      config: { preload: call },
      paths: value.paths,
      ...(value.define ? { define: value.define } : {}),
      next: "修改生成的配置前，请先读取 electron.readme 资源。",
    };
  }
  hono(input: z.output<typeof honoValidator>) {
    const { rendererName } = honoValidator.parse(input);
    return {
      packageName,
      import: [
        "import { Hono } from \"hono\";",
        "import { honoServer, honoUrl } from \"" + packageName
          + "/mainPlugin/hono\";",
      ],
      server: "const server = honoServer(new Hono().get(\"/health\", "
        + "context => context.json({ ok: true })));",
      url: "honoUrl(" + JSON.stringify(rendererName) + ")",
      rendererName,
      next: "请使用 mainPlugin 与 rendererPlugin 的同一组端口；修改运行时代码前先读取 electron.readme。",
    };
  }
  rendererLoad(input: z.output<typeof rendererLoadValidator>) {
    const value = rendererLoadValidator.parse(input);
    return {
      packageName,
      import: "import rendererLoad from \"" + packageName
        + "/rendererReactPlugin/electron\";",
      call: "await rendererLoad({ webContents: window.webContents, name: "
        + JSON.stringify(value.rendererName)
        + (value.hash === undefined
          ? ""
          : ", hash: " + JSON.stringify(value.hash))
        + " });",
      rendererName: value.rendererName,
      ...(value.hash === undefined ? {} : { hash: value.hash }),
      next: "不要根据 app.isPackaged 分支，也不要手动拼接开发或生产环境地址。",
    };
  }
  preloadPath(input: z.output<typeof preloadPathValidator>) {
    const { name } = preloadPathValidator.parse(input);
    return {
      packageName,
      import: "import preloadPath from \"" + packageName
        + "/preloadCreate/electron\";",
      call: "preload: preloadPath(" + JSON.stringify(name) + ")",
      name,
      next: "不要手动拼接 out/preload 路径；请读取 electron.readme 中配套的 preloadConfig 约定。",
    };
  }
}
export const electronViteConfig = new ElectronViteConfig();

