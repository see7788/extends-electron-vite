import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { spawnSync, type SpawnSyncReturns } from "node:child_process";

type PackageJson = {
  name?: unknown;
  version?: unknown;
} & Record<string, unknown>;

type ReleaseIdentity = {
  notes: string;
  tag: string;
  tagPrefix: string;
  title: string;
  version: string;
};

type Repository = {
  owner: string;
  repo: string;
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
  capture = false,
): SpawnSyncReturns<string> => spawnSync(command, args, {
  cwd,
  encoding: "utf8",
  env,
  shell: process.platform === "win32" && command === "pnpm",
  stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
});

const run = (command: string, args: string[], env: NodeJS.ProcessEnv) => {
  const result = spawn(command, args, env);
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} 执行失败，退出码：${result.status ?? "未知"}`);
  }
};

const capture = (command: string, args: string[], env: NodeJS.ProcessEnv) => {
  const result = spawn(command, args, env, true);
  if (result.error) throw result.error;
  if (result.status !== 0) return undefined;
  return result.stdout.trim() || undefined;
};

const tokenRead = () => {
  const configured = process.env.GH_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim();
  if (configured) return configured;

  // 令牌只从环境变量或 gh 登录状态读取，不写入项目文件。
  const token = capture("gh", ["auth", "token"], process.env);
  if (!token) {
    throw new Error("无法取得 GitHub 登录凭据，请先执行一次 `gh auth login`。");
  }
  return token;
};

const repositoryRead = (): Repository => {
  const remote = capture("git", ["remote", "get-url", "origin"], process.env);
  const normalized = remote?.replace(/\/$/, "").replace(/\.git$/, "");
  const match = normalized?.match(/github\.com(?::|\/)([^/]+)\/([^/]+)$/i);
  if (!match) {
    throw new Error("当前项目的 git origin 必须是 GitHub 仓库。");
  }
  return { owner: match[1], repo: match[2] };
};

const releaseIdentityRead = (): ReleaseIdentity => {
  const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8")) as PackageJson;
  if (typeof pkg.name !== "string" || !pkg.name.trim()) {
    throw new Error("package.json#name 必须是非空字符串。");
  }
  if (typeof pkg.version !== "string" || !pkg.version.trim()) {
    throw new Error("package.json#version 必须是非空字符串。");
  }
  if (typeof pkg.description !== "string" || !pkg.description.trim()) {
    throw new Error("package.json#description 必须是非空字符串。");
  }
  const name = pkg.name.trim();
  const notes = pkg.description.trim();
  // tag 使用当前子项目名，避免 pnpm 多包仓库中的相同版本号相互冲突。
  const tagName = name.replace(/^@/, "").replace(/[^a-zA-Z0-9._-]+/g, "-");
  const version = pkg.version.trim();
  const tagPrefix = `${tagName}-v`;
  return {
    notes,
    tag: `${tagPrefix}${version}`,
    tagPrefix,
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
  if (existsSync(resourcesPath)) {
    cpSync(resourcesPath, join(stageRoot, "resources"), { recursive: true });
  }
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

const releasePrepare = (
  tag: string,
  title: string,
  notes: string,
  repository: Repository,
  env: NodeJS.ProcessEnv,
) => {
  const slug = `${repository.owner}/${repository.repo}`;
  const isDraft = capture(
    "gh",
    ["release", "view", tag, "--repo", slug, "--json", "isDraft", "--jq", ".isDraft"],
    env,
  );
  if (isDraft === "false") {
    throw new Error(`GitHub 发布版本 ${tag} 已经存在，请提高 package.json#version。`);
  }
  if (isDraft !== "true") {
    // 先建立唯一草稿，避免 electron-builder 并行上传资产时创建重复草稿。
    run(
      "gh",
      ["release", "create", tag, "--repo", slug, "--draft", "--title", title, "--notes", notes],
      env,
    );
  } else {
    run("gh", ["release", "edit", tag, "--repo", slug, "--title", title, "--notes", notes], env);
  }
};

const releasePublish = (tag: string, repository: Repository, env: NodeJS.ProcessEnv) => {
  run(
    "gh",
    ["release", "edit", tag, "--repo", `${repository.owner}/${repository.repo}`, "--draft=false"],
    env,
  );
};

const main = () => {
  // gh 与 electron-builder 是第三方命令，其底层构建日志可能仍然显示英文。
  const token = tokenRead();
  const repository = repositoryRead();
  const release = releaseIdentityRead();
  // GitHub 令牌仅传给本次发布子进程，不持久化到磁盘。
  const env = { ...process.env, GH_TOKEN: token };

  run("pnpm", ["build"], env);
  const runtimeDependencies = runtimeDependenciesRead();
  stagePrepare(runtimeDependencies);
  releasePrepare(release.tag, release.title, release.notes, repository, env);
  try {
    run("pnpm", [
      "exec",
      "electron-builder",
      "--projectDir",
      stageRoot,
      "--config",
      join(cwd, "resources", "electron-builder.yml"),
      "--publish",
      "always",
      `--config.directories.output=${join(cwd, ".dist", "release", "${version}")}`,
      `--config.publish.owner=${repository.owner}`,
      `--config.publish.repo=${repository.repo}`,
      `--config.publish.tagNamePrefix=${release.tagPrefix}`,
    ], env);
  } finally {
    stageClear();
  }
  releasePublish(release.tag, repository, env);
};

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
