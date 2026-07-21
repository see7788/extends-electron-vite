import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export type V2rayNConfig = Record<string, unknown> & {
  IndexId?: string;
  SystemProxyItem?: unknown;
  TunModeItem?: unknown;
};

export type V2rayNNode = {
  indexId: string;
  remarks?: string;
  configType?: string;
  address?: string;
  port?: number;
};

export type V2rayNOptions = {
  exePath?: string;
  baseDir: string;
  configDir: string;
  logDir: string;
  configFileName: string;
  databaseFileName: string;
  sqliteQuery?: (databasePath: string) => Promise<V2rayNNode[]>;
};

export type V2rayNStatus = {
  isRunning: boolean;
  pid?: number;
  exePath?: string;
  configPath: string;
  databasePath: string;
  currentIndexId?: string;
};

export default class V2rayN {
  private options: V2rayNOptions;
  private process?: ChildProcess;

  constructor(options: Partial<V2rayNOptions> = {}) {
    const baseDir = options.baseDir ?? this.defaultBaseDir();

    this.options = {
      exePath: options.exePath,
      baseDir,
      configDir: options.configDir ?? path.join(baseDir, "guiConfigs"),
      logDir: options.logDir ?? path.join(baseDir, "guiLogs"),
      configFileName: options.configFileName ?? "guiNConfig.json",
      databaseFileName: options.databaseFileName ?? "guiNDB.db",
      sqliteQuery: options.sqliteQuery,
    };
  }

  async configRead(): Promise<V2rayNConfig | undefined> {
    try {
      const text = await fs.promises.readFile(this.configPath(), "utf8");
      return JSON.parse(text) as V2rayNConfig;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return undefined;
      }
      throw error;
    }
  }

  async configWrite(config: V2rayNConfig): Promise<V2rayNConfig> {
    await fs.promises.mkdir(this.options.configDir, { recursive: true });
    const configPath = this.configPath();
    const tempPath = `${configPath}_temp`;
    await fs.promises.writeFile(tempPath, JSON.stringify(config, null, 2), "utf8");
    await fs.promises.rename(tempPath, configPath);
    return config;
  }

  async nodeUse(indexId: string): Promise<V2rayNConfig> {
    const config = await this.configRead();
    if (!config) {
      throw new Error(`v2rayN config not found: ${this.configPath()}`);
    }

    config.IndexId = indexId;
    return this.configWrite(config);
  }

  async nodesRead(): Promise<{ databasePath: string; nodes: V2rayNNode[]; note?: string }> {
    const databasePath = this.databasePath();
    if (this.options.sqliteQuery) {
      return { databasePath, nodes: await this.options.sqliteQuery(databasePath) };
    }

    return {
      databasePath,
      nodes: [],
      note: "v2rayN stores profiles in guiNDB.db. Pass sqliteQuery to read nodes without adding a sqlite dependency to this package.",
    };
  }

  async outletRead(): Promise<{ indexId?: string; systemProxyItem?: unknown; tunModeItem?: unknown }> {
    const config = await this.configRead();
    return {
      indexId: config?.IndexId,
      systemProxyItem: config?.SystemProxyItem,
      tunModeItem: config?.TunModeItem,
    };
  }

  async statusRead(): Promise<V2rayNStatus> {
    const config = await this.configRead();
    const pid = await this.pidRead();
    const isRunning = pid === undefined ? false : this.pidIsRunning(pid);

    return {
      isRunning,
      pid,
      exePath: this.options.exePath,
      configPath: this.configPath(),
      databasePath: this.databasePath(),
      currentIndexId: config?.IndexId,
    };
  }

  async processStart(): Promise<V2rayNStatus> {
    if (!this.options.exePath) {
      throw new Error("v2rayN exePath is required to start process");
    }

    await fs.promises.access(this.options.exePath, fs.constants.X_OK);
    this.process = spawn(this.options.exePath, [], {
      cwd: path.dirname(this.options.exePath),
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    });
    this.process.unref();
    await fs.promises.mkdir(this.options.configDir, { recursive: true });
    await fs.promises.writeFile(this.pidPath(), String(this.process.pid), "utf8");

    return this.statusRead();
  }

  async processStop(): Promise<V2rayNStatus> {
    const pid = await this.pidRead();
    if (pid !== undefined && this.pidIsRunning(pid)) {
      process.kill(pid);
    }
    await fs.promises.rm(this.pidPath(), { force: true });
    return this.statusRead();
  }

  async logsRead(maxLength = 20000): Promise<string> {
    try {
      const logs = await fs.promises.readdir(this.options.logDir);
      const logFiles = logs.filter(logName => logName.toLowerCase().endsWith(".txt") || logName.toLowerCase().endsWith(".log"));
      if (!logFiles.length) {
        return "";
      }

      const logStats = await Promise.all(logFiles.map(async logName => ({
        logName,
        stat: await fs.promises.stat(path.join(this.options.logDir, logName)),
      })));
      logStats.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);

      const text = await fs.promises.readFile(path.join(this.options.logDir, logStats[0].logName), "utf8");
      return text.slice(Math.max(0, text.length - maxLength));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return "";
      }
      throw error;
    }
  }

  configPath() {
    return path.join(this.options.configDir, this.options.configFileName);
  }

  databasePath() {
    return path.join(this.options.configDir, this.options.databaseFileName);
  }

  private pidPath() {
    return path.join(this.options.configDir, "v2rayn.pid");
  }

  private async pidRead() {
    try {
      const text = await fs.promises.readFile(this.pidPath(), "utf8");
      const pid = Number(text.trim());
      return Number.isFinite(pid) ? pid : undefined;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return undefined;
      }
      throw error;
    }
  }

  private pidIsRunning(pid: number) {
    try {
      process.kill(pid, 0);
      return true;
    } catch {
      return false;
    }
  }

  private defaultBaseDir() {
    if (process.platform === "win32") {
      return path.join(process.env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local"), "v2rayN");
    }

    return path.join(os.homedir(), ".local", "share", "v2rayN");
  }
}
