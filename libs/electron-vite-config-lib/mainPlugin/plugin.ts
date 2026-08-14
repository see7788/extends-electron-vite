import {
  existsSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import { builtinModules } from "node:module";
import { dirname, isAbsolute, join, parse } from "node:path";
import type { Plugin } from "vite";
import {
  defineRead,
  portsRead,
  type mainPlugin_t,
} from "electron-vite-config-lib/public";

const honoPort = "process.env.HONO_PORT";
const mainOutputDirectory = ".dist/out/main";
const runtimeManifestName = "runtime-dependencies.json";
const binaryExtensions = new Set([".dll", ".dylib", ".exe", ".node", ".so"]);
const nodeBuiltins = new Set([
  ...builtinModules,
  ...builtinModules.map(name => `node:${name}`),
]);
const forcedRuntimePackages = new Set(["electron-updater"]);

type PackageJson = {
  name?: unknown;
  version?: unknown;
  bin?: unknown;
  binary?: unknown;
  cpu?: unknown;
  gypfile?: unknown;
  optionalDependencies?: unknown;
  os?: unknown;
  scripts?: Record<string, unknown>;
};

type RuntimeDependency = {
  name: string;
  root: string;
  version: string;
};

const packageNameRead = (source: string): string | undefined => {
  if (!source || source.startsWith(".") || source.startsWith("/") || isAbsolute(source)) {
    return undefined;
  }
  const parts = source.split("/");
  if (source.startsWith("@")) return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : undefined;
  return parts[0];
};

const packageRootRead = (resolvedId: string, packageName: string): string | undefined => {
  let directory = dirname(resolvedId.replace(/^\0/, "").split("?", 1)[0]);
  while (true) {
    const packageJsonPath = join(directory, "package.json");
    if (existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as PackageJson;
        if (pkg.name === packageName) return directory;
      } catch {
        return undefined;
      }
    }
    const parent = dirname(directory);
    if (parent === directory) return undefined;
    directory = parent;
  }
};

const packageHasBinary = (root: string): boolean => {
  const pending = [root];
  while (pending.length) {
    const directory = pending.pop()!;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === ".git" || entry.name === "node_modules") continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        pending.push(path);
      } else if (binaryExtensions.has(parse(entry.name).ext.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
};

const packageNeedsRuntime = (root: string, pkg: PackageJson): boolean => {
  const scripts = pkg.scripts ?? {};
  return pkg.bin !== undefined
    || pkg.binary !== undefined
    || pkg.cpu !== undefined
    || pkg.gypfile === true
    || pkg.optionalDependencies !== undefined
    || pkg.os !== undefined
    || scripts.preinstall !== undefined
    || scripts.install !== undefined
    || scripts.postinstall !== undefined
    || packageHasBinary(root);
};

export default function mainPlugin({
  ports,
  define,
}: mainPlugin_t): Plugin {
  if (Object.hasOwn(define ?? {}, honoPort)) {
    throw new Error(`${honoPort} is reserved by mainPlugin`);
  }
  const [mainPort, otherPort] = portsRead(ports);
  const userDefine = defineRead(define);
  const runtimeDependencies = new Map<string, RuntimeDependency>();
  const packageRuntimeCache = new Map<string, RuntimeDependency | null>();

  return {
    // 使用 electron-vite 的保留插件名，阻止其默认把全部 dependencies 设为 external。
    name: "vite:externalize-deps",
    enforce: "pre",
    config(_config, configEnv) {
      const port = configEnv.command === "serve" ? otherPort : mainPort;
      return {
        build: { outDir: mainOutputDirectory },
        define: {
          ...userDefine,
          [honoPort]: JSON.stringify(String(port)),
        },
      };
    },
    async resolveId(source, importer) {
      if (source === "electron" || source.startsWith("electron/") || nodeBuiltins.has(source)) {
        return { id: source, external: true };
      }
      const packageName = packageNameRead(source);
      if (!packageName) return null;

      const cached = packageRuntimeCache.get(packageName);
      if (cached !== undefined) {
        if (cached) runtimeDependencies.set(cached.name, cached);
        return cached ? { id: source, external: true } : null;
      }

      const resolved = await this.resolve(source, importer, { skipSelf: true });
      if (!resolved || resolved.external) return null;
      const root = packageRootRead(resolved.id, packageName);
      if (!root) return null;
      const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as PackageJson;
      const runtime = forcedRuntimePackages.has(packageName) || packageNeedsRuntime(root, pkg)
        ? {
            name: packageName,
            root,
            version: typeof pkg.version === "string" ? pkg.version : "0.0.0",
          }
        : null;
      packageRuntimeCache.set(packageName, runtime);
      if (!runtime) return null;
      runtimeDependencies.set(runtime.name, runtime);
      return { id: source, external: true };
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: runtimeManifestName,
        source: `${JSON.stringify({
          dependencies: [...runtimeDependencies.values()].sort((left, right) => (
            left.name.localeCompare(right.name)
          )),
          version: 1,
        }, null, 2)}\n`,
      });
    },
  };
}
