import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { basename, dirname, join } from "node:path";
import { spawnSync, type SpawnSyncReturns } from "node:child_process";

type PackageJson = {
  name?: unknown;
  version?: unknown;
} & Record<string, unknown>;

type ReleaseIdentity = {
  notes: string;
  tag: string;
  title: string;
  version: string;
};

type RuntimeDependency = {
  name: string;
  root: string;
  version: string;
};

type RuntimeManifest = {
  dependencies?: unknown;
  version?: unknown;
};

const cwd = process.cwd();
const stageRoot = join(cwd, ".dist", "stage");
const require = createRequire(join(cwd, "package.json"));

const spawn = (
  command: string,
  args: string[],
  env: NodeJS.ProcessEnv,
): SpawnSyncReturns<string> => spawnSync(command, args, {
  cwd,
  encoding: "utf8",
  env,
  shell: process.platform === "win32" && command === "pnpm",
  stdio: "inherit",
});

const run = (command: string, args: string[], env: NodeJS.ProcessEnv) => {
  const result = spawn(command, args, env);
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} 执行失败，退出码：${result.status ?? "未知"}`);
  }
};

const versionNextRead = (version: string) => {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return "0.0.1";
  const patch = Number(match[3]) + 1;
  if (!Number.isSafeInteger(patch)) return "0.0.1";
  return `${match[1]}.${match[2]}.${patch}`;
};

const releaseIdentityRead = (): ReleaseIdentity => {
  const packageJsonPath = join(cwd, "package.json");
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as PackageJson;
  const name = typeof pkg.name === "string" && pkg.name.trim()
    ? pkg.name.trim()
    : basename(cwd);
  const version = versionNextRead(typeof pkg.version === "string" ? pkg.version.trim() : "");
  const notes = typeof pkg.description === "string" && pkg.description.trim()
    ? pkg.description.trim()
    : name;
  pkg.description = notes;
  pkg.name = name;
  pkg.version = version;
  writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  // tag 使用当前子项目名，避免 pnpm 多包仓库中的相同版本号相互冲突。
  const tagName = name.replace(/^@/, "").replace(/[^a-zA-Z0-9._-]+/g, "-");
  const tagPrefix = `${tagName}-v`;
  return {
    notes,
    tag: `${tagPrefix}${version}`,
    title: `${name} ${version}`,
    version,
  };
};

const runtimeDependenciesRead = (): RuntimeDependency[] => {
  const manifestPath = join(cwd, ".dist", "out", "main", "runtime-dependencies.json");
  if (!existsSync(manifestPath)) {
    throw new Error("缺少运行时依赖清单，请在 electron-vite main 中使用 mainPlugin。");
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as RuntimeManifest;
  if (manifest.version !== 1 || !Array.isArray(manifest.dependencies)) {
    throw new Error(`运行时依赖清单格式无效：${manifestPath}`);
  }
  return manifest.dependencies.map((value, index) => {
    if (!value || typeof value !== "object") {
      throw new Error(`运行时依赖清单第 ${index + 1} 项格式无效。`);
    }
    const dependency = value as Partial<RuntimeDependency>;
    if (
      typeof dependency.name !== "string"
      || typeof dependency.root !== "string"
      || typeof dependency.version !== "string"
      || !existsSync(dependency.root)
    ) {
      throw new Error(`运行时依赖清单第 ${index + 1} 项内容无效。`);
    }
    return dependency as RuntimeDependency;
  });
};

const stagePackageRead = (runtimeDependencies: RuntimeDependency[]) => {
  const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8")) as PackageJson;
  const stagePackage = { ...pkg };
  const electronPackagePath = require.resolve("electron/package.json");
  const electronPackage = JSON.parse(readFileSync(electronPackagePath, "utf8")) as PackageJson;
  if (typeof electronPackage.version !== "string" || !electronPackage.version) {
    throw new Error("无法读取已安装 Electron 的精确版本。");
  }
  stagePackage.devDependencies = { electron: electronPackage.version };
  delete stagePackage.pnpm;
  delete stagePackage.scripts;
  stagePackage.dependencies = Object.fromEntries(runtimeDependencies.map(dependency => [
    dependency.name,
    dependency.version,
  ]));
  return stagePackage;
};

const stagePrepare = (runtimeDependencies: RuntimeDependency[]) => {
  rmSync(stageRoot, { force: true, recursive: true });
  mkdirSync(stageRoot, { recursive: true });
  cpSync(join(cwd, ".dist", "out"), join(stageRoot, ".dist", "out"), { recursive: true });
  const resourcesPath = join(cwd, "resources");
  cpSync(resourcesPath, join(stageRoot, "resources"), { recursive: true });
  writeFileSync(
    join(stageRoot, "package.json"),
    `${JSON.stringify(stagePackageRead(runtimeDependencies), null, 2)}\n`,
    "utf8",
  );

  for (const dependency of runtimeDependencies) {
    const target = join(stageRoot, "node_modules", ...dependency.name.split("/"));
    mkdirSync(dirname(target), { recursive: true });
    symlinkSync(dependency.root, target, process.platform === "win32" ? "junction" : "dir");
  }
};

const stageClear = () => rmSync(stageRoot, { force: true, recursive: true });

const releasePublish = (
  release: ReleaseIdentity,
  outputPath: string,
  env: NodeJS.ProcessEnv,
) => {
  const assets = readdirSync(outputPath, { withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => join(outputPath, entry.name));
  run(
    "gh",
    ["release", "create", release.tag, ...assets, "--title", release.title, "--notes", release.notes],
    env,
  );
};

const main = () => {
  // gh 与 electron-builder 是第三方命令，其底层构建日志可能仍然显示英文。
  const release = releaseIdentityRead();
  const env = process.env;
  const outputPath = join(cwd, ".dist", "release", release.version);

  run("pnpm", ["build"], env);
  const runtimeDependencies = runtimeDependenciesRead();
  stagePrepare(runtimeDependencies);
  try {
    run("pnpm", [
      "exec",
      "electron-builder",
      "--projectDir",
      stageRoot,
      "--config",
      join(cwd, "resources", "electron-builder.yml"),
      "--publish",
      "never",
      `--config.directories.output=${outputPath}`,
    ], env);
  } finally {
    stageClear();
  }
  releasePublish(release, outputPath, env);
};

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
