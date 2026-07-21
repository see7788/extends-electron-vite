import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";

export type FrpSshConfig = {
  host: string;
  port: number;
  username: string;
  password?: string;
};

export type FrpTunnel = {
  name: string;
  type: "tcp" | "udp" | "http" | "https";
  localIP: string;
  localPort: number;
  remotePort?: number;
  customDomains?: string[];
  useCompression?: boolean;
  useEncryption?: boolean;
};

export type FrpConfig = {
  version: string;
  domain: string;
  workDir: string;
  frpcPath: string;
  frpsPath: string;
  mode: "client" | "server";
  serverAddr: string;
  serverPort: number;
  serverHttpPort: number;
  token: string;
  adminAddr: string;
  adminPort: number;
  adminUser: string;
  adminPassword: string;
  ssh: FrpSshConfig;
  tunnels: FrpTunnel[];
};

export type FrpStatus = {
  mode: FrpConfig["mode"];
  isRunning: boolean;
  pid?: number;
  clientConfigPath: string;
  serverConfigPath: string;
  logPath: string;
  addresses: string[];
};

export default class Frp {
  private config: FrpConfig;
  private process?: ChildProcess;

  constructor(config: Partial<FrpConfig> = {}) {
    const workDir = config.workDir ?? path.join(process.cwd(), ".frp");
    const serverAddr = config.serverAddr ?? "82.156.162.242";
    const serverHttpPort = config.serverHttpPort ?? 8080;

    this.config = {
      version: config.version ?? "0.54.0",
      domain: config.domain ?? "13520521413.store",
      workDir,
      frpcPath: config.frpcPath ?? path.join(workDir, os.platform() === "win32" ? "frpc.exe" : "frpc"),
      frpsPath: config.frpsPath ?? path.join(workDir, os.platform() === "win32" ? "frps.exe" : "frps"),
      mode: config.mode ?? "client",
      serverAddr,
      serverPort: config.serverPort ?? 7000,
      serverHttpPort,
      token: config.token ?? process.env.EXTENDS_FRP_TOKEN ?? "frp_" + Math.random().toString(36).slice(2, 12),
      adminAddr: config.adminAddr ?? "127.0.0.1",
      adminPort: config.adminPort ?? 7400,
      adminUser: config.adminUser ?? "admin",
      adminPassword: config.adminPassword ?? "admin",
      ssh: {
        host: config.ssh?.host ?? serverAddr,
        port: config.ssh?.port ?? 54321,
        username: config.ssh?.username ?? "root",
        password: config.ssh?.password ?? process.env.EXTENDS_FRP_SSH_PASSWORD,
      },
      tunnels: config.tunnels ?? [
        {
          name: "nodetunnel",
          type: "tcp",
          localIP: "127.0.0.1",
          localPort: 3000,
          remotePort: serverHttpPort,
          useCompression: true,
          useEncryption: true,
        },
      ],
    };
  }

  async configRead(): Promise<FrpConfig> {
    try {
      const text = await fs.promises.readFile(this.settingsPath(), "utf8");
      this.config = { ...this.config, ...JSON.parse(text) as FrpConfig };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }

    return this.config;
  }

  async configWrite(config: Partial<FrpConfig> = {}): Promise<FrpConfig> {
    this.config = {
      ...this.config,
      ...config,
      ssh: { ...this.config.ssh, ...config.ssh },
      tunnels: config.tunnels ?? this.config.tunnels,
    };
    await fs.promises.mkdir(this.config.workDir, { recursive: true });

    await fs.promises.writeFile(this.settingsPath(), JSON.stringify(this.config, null, 2), "utf8");
    await fs.promises.writeFile(this.clientConfigPath(), this.clientConfigText(), "utf8");
    await fs.promises.writeFile(this.serverConfigPath(), this.serverConfigText(), "utf8");

    return this.config;
  }

  async tunnelAdd(tunnel: FrpTunnel): Promise<FrpTunnel[]> {
    const config = await this.configRead();
    const tunnels = config.tunnels.filter(current => current.name !== tunnel.name);
    tunnels.push(tunnel);
    await this.configWrite({ tunnels });
    return tunnels;
  }

  async tunnelsRead(): Promise<FrpTunnel[]> {
    return (await this.configRead()).tunnels;
  }

  async addressRead(): Promise<string[]> {
    const config = await this.configRead();
    return config.tunnels.map(tunnel => {
      if ((tunnel.type === "http" || tunnel.type === "https") && tunnel.customDomains?.[0]) {
        return `${tunnel.type}://${tunnel.customDomains[0]}`;
      }

      return `${config.serverAddr}:${tunnel.remotePort ?? config.serverHttpPort}`;
    });
  }

  async statusRead(): Promise<FrpStatus> {
    const config = await this.configRead();
    const pid = await this.pidRead();
    const isRunning = pid === undefined ? false : this.pidIsRunning(pid);

    return {
      mode: config.mode,
      isRunning,
      pid,
      clientConfigPath: this.clientConfigPath(),
      serverConfigPath: this.serverConfigPath(),
      logPath: this.logPath(),
      addresses: await this.addressRead(),
    };
  }

  async processStart(mode = this.config.mode): Promise<FrpStatus> {
    const config = await this.configWrite({ mode });
    const binPath = mode === "server" ? config.frpsPath : config.frpcPath;
    const configPath = mode === "server" ? this.serverConfigPath() : this.clientConfigPath();

    await fs.promises.mkdir(config.workDir, { recursive: true });
    await fs.promises.access(binPath, fs.constants.X_OK);

    const logFile = await fs.promises.open(this.logPath(), "a");
    this.process = spawn(binPath, ["-c", configPath], {
      cwd: config.workDir,
      detached: true,
      stdio: ["ignore", logFile.fd, logFile.fd],
      windowsHide: true,
    });
    this.process.unref();
    await logFile.close();
    await fs.promises.writeFile(this.pidPath(), String(this.process.pid), "utf8");

    return this.statusRead();
  }

  async processStop(): Promise<FrpStatus> {
    const pid = await this.pidRead();
    if (pid !== undefined && this.pidIsRunning(pid)) {
      process.kill(pid);
    }
    await fs.promises.rm(this.pidPath(), { force: true });
    return this.statusRead();
  }

  async logsRead(maxLength = 20000): Promise<string> {
    try {
      const text = await fs.promises.readFile(this.logPath(), "utf8");
      return text.slice(Math.max(0, text.length - maxLength));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return "";
      }
      throw error;
    }
  }

  async localPortCheck(localPort: number): Promise<boolean> {
    return new Promise(resolve => {
      const socket = net.createConnection(localPort, "127.0.0.1");
      socket.once("connect", () => {
        socket.destroy();
        resolve(true);
      });
      socket.once("error", () => resolve(false));
    });
  }

  async serverScriptRead(): Promise<string> {
    const config = await this.configWrite();
    return [
      "set -e",
      `FRP_VERSION=${this.shellQuote(config.version)}`,
      `FRP_DIR=${this.shellQuote("/root/data/frp")}`,
      "mkdir -p \"$FRP_DIR\"",
      "cd \"$FRP_DIR\"",
      "if [ ! -f \"frp_${FRP_VERSION}_linux_amd64.tar.gz\" ]; then",
      "  wget --no-check-certificate \"https://github.com/fatedier/frp/releases/download/v${FRP_VERSION}/frp_${FRP_VERSION}_linux_amd64.tar.gz\"",
      "fi",
      "tar -zxf \"frp_${FRP_VERSION}_linux_amd64.tar.gz\" --overwrite || true",
      "cd \"frp_${FRP_VERSION}_linux_amd64\"",
      `cat > frps.toml <<'EOF'`,
      this.serverConfigText(),
      "EOF",
      "pkill -9 -f frps 2>/dev/null || true",
      `ufw allow ${config.serverPort}/tcp >/dev/null 2>&1 || true`,
      `ufw allow ${config.serverPort}/udp >/dev/null 2>&1 || true`,
      `ufw allow ${config.serverHttpPort}/tcp >/dev/null 2>&1 || true`,
      "ufw reload >/dev/null 2>&1 || true",
      "nohup ./frps -c ./frps.toml > frps.log 2>&1 &",
    ].join("\n");
  }

  async serverSshCommandRead(): Promise<string> {
    const config = await this.configRead();
    return `ssh -p ${config.ssh.port} ${config.ssh.username}@${config.ssh.host}`;
  }

  private settingsPath() {
    return path.join(this.config.workDir, "frp.config.json");
  }

  private clientConfigPath() {
    return path.join(this.config.workDir, "frpc.toml");
  }

  private serverConfigPath() {
    return path.join(this.config.workDir, "frps.toml");
  }

  private logPath() {
    return path.join(this.config.workDir, `${this.config.mode === "server" ? "frps" : "frpc"}.log`);
  }

  private pidPath() {
    return path.join(this.config.workDir, `${this.config.mode === "server" ? "frps" : "frpc"}.pid`);
  }

  private clientConfigText() {
    const config = this.config;
    return [
      `serverAddr = ${JSON.stringify(config.serverAddr)}`,
      `serverPort = ${config.serverPort}`,
      "",
      `auth.method = "token"`,
      `auth.token = ${JSON.stringify(config.token)}`,
      "",
      `webServer.addr = ${JSON.stringify(config.adminAddr)}`,
      `webServer.port = ${config.adminPort}`,
      `webServer.user = ${JSON.stringify(config.adminUser)}`,
      `webServer.password = ${JSON.stringify(config.adminPassword)}`,
      "",
      ...config.tunnels.flatMap(tunnel => [
        "[[proxies]]",
        `name = ${JSON.stringify(tunnel.name)}`,
        `type = ${JSON.stringify(tunnel.type)}`,
        `localIP = ${JSON.stringify(tunnel.localIP)}`,
        `localPort = ${tunnel.localPort}`,
        tunnel.remotePort === undefined ? "" : `remotePort = ${tunnel.remotePort}`,
        tunnel.customDomains?.length ? `customDomains = ${JSON.stringify(tunnel.customDomains)}` : "",
        tunnel.useCompression === undefined ? "" : `transport.useCompression = ${tunnel.useCompression}`,
        tunnel.useEncryption === undefined ? "" : `transport.useEncryption = ${tunnel.useEncryption}`,
        "",
      ]),
    ].filter(Boolean).join("\n") + "\n";
  }

  private serverConfigText() {
    const config = this.config;
    return [
      `bindPort = ${config.serverPort}`,
      `kcpBindPort = ${config.serverPort}`,
      `vhostHTTPPort = ${config.serverHttpPort}`,
      "",
      `auth.method = "token"`,
      `auth.token = ${JSON.stringify(config.token)}`,
      "",
      `allowPorts = [`,
      `  { single = ${config.serverHttpPort} },`,
      `]`,
      "",
      `log.to = "./frps.log"`,
      `log.level = "debug"`,
      `log.maxDays = 3`,
    ].join("\n") + "\n";
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

  private shellQuote(text: string) {
    return `'${text.replace(/'/g, "'\\''")}'`;
  }
}
