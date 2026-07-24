import type { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { createSocket } from "node:dgram";
import { access } from "node:fs/promises";
import { get } from "node:http";
import { homedir } from "node:os";
import { join } from "node:path";
import CodexAppServer from "./CodexAppServer";

export default class CodexCli {
  private static readonly fileCredentialConfig = "cli_auth_credentials_store=\"file\"";
  private remoteCommand: string | undefined;
  private remoteProcess: ChildProcess | undefined;

  async readyValid() {
    if (!(await this.executablePathRead())) {
      throw new Error("没有找到 Codex CLI");
    }
  }

  async appServerOpen() {
    const executablePath = await this.executablePathRead();
    if (!executablePath) {
      throw new Error("无法启动 Codex App Server：没有找到 Codex CLI");
    }
    const appServer = new CodexAppServer(executablePath);
    await appServer.connectionOpen();
    return appServer;
  }

  readonly login = async () => {
    const executablePath = await this.executablePathRead();
    if (!executablePath) {
      throw new Error("无法启动 Codex 官方登录：没有找到 Codex CLI");
    }
    await new Promise<void>((resolvePromise, rejectPromise) => {
      let errorText = "";
      const loginProcess = spawn(executablePath, [
        "login",
        "-c",
        CodexCli.fileCredentialConfig,
      ], {
        shell: executablePath.toLowerCase().endsWith(".cmd"),
        stdio: ["ignore", "ignore", "pipe"],
        windowsHide: true,
      });
      loginProcess.stderr.on("data", (chunk: Buffer) => {
        errorText += chunk.toString("utf8");
      });
      loginProcess.once("error", rejectPromise);
      loginProcess.once("close", (exitCode) => {
        if (exitCode === 0) {
          resolvePromise();
          return;
        }
        rejectPromise(new Error(
          `Codex 官方登录失败，退出码：${String(exitCode)}`
          + `${errorText.trim() ? `：${errorText.trim()}` : ""}`,
        ));
      });
    });
  };

  readonly install = async () => {
    await new Promise<void>((resolvePromise, rejectPromise) => {
      const installProcess = spawn("npm.cmd", [
        "install",
        "--global",
        "@openai/codex@latest",
      ], {
        shell: true,
        stdio: "ignore",
        windowsHide: true,
      });
      installProcess.once("error", rejectPromise);
      installProcess.once("close", (exitCode) => {
        if (exitCode === 0) {
          resolvePromise();
          return;
        }
        rejectPromise(new Error(`npm 安装 @openai/codex 失败，退出码：${String(exitCode)}`));
      });
    });
    await this.readyValid();
  };

  async appServerRemoteOpen() {
    if (
      this.remoteProcess
      && this.remoteProcess.exitCode === null
      && this.remoteCommand
    ) {
      return this.remoteCommand;
    }
    const executablePath = await this.executablePathRead();
    if (!executablePath) {
      throw new Error("无法启动 Codex 远程 App Server：没有找到 Codex CLI");
    }
    const localAddress = await new Promise<string>((resolvePromise, rejectPromise) => {
      const routeSocket = createSocket("udp4");
      routeSocket.once("error", rejectPromise);
      routeSocket.connect(53, "1.1.1.1", () => {
        const address = routeSocket.address();
        routeSocket.close();
        resolvePromise(address.address);
      });
    });
    const port = 4500;
    const token = randomBytes(32).toString("base64url");
    const tokenSha256 = createHash("sha256").update(token).digest("hex");
    const remoteProcess = spawn(executablePath, [
      "app-server",
      "-c",
      CodexCli.fileCredentialConfig,
      "--listen",
      `ws://${localAddress}:${port}`,
      "--ws-auth",
      "capability-token",
      "--ws-token-sha256",
      tokenSha256,
    ], {
      shell: executablePath.toLowerCase().endsWith(".cmd"),
      stdio: ["ignore", "ignore", "pipe"],
      windowsHide: true,
    });
    let errorText = "";
    const errorReceive = (chunk: Buffer) => {
      errorText += chunk.toString("utf8");
    };
    remoteProcess.stderr.on("data", errorReceive);
    await new Promise<void>((resolvePromise, rejectPromise) => {
      remoteProcess.once("spawn", resolvePromise);
      remoteProcess.once("error", rejectPromise);
    });
    let isReady = false;
    for (let validationCount = 0; validationCount < 100; validationCount += 1) {
      if (remoteProcess.exitCode !== null) break;
      isReady = await new Promise<boolean>((resolvePromise) => {
        const request = get({
          hostname: localAddress,
          port,
          path: "/readyz",
        }, (response) => {
          response.resume();
          resolvePromise(response.statusCode === 200);
        });
        request.setTimeout(200, () => request.destroy());
        request.once("error", () => resolvePromise(false));
      });
      if (isReady) break;
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));
    }
    if (!isReady || remoteProcess.exitCode !== null) {
      remoteProcess.kill();
      throw new Error(
        `Codex 远程 App Server 启动失败${errorText.trim() ? `：${errorText.trim()}` : ""}`,
      );
    }
    remoteProcess.stderr.off("data", errorReceive);
    const remoteCommand = `cmd /d /c "set CODEX_REMOTE_TOKEN=${token}`
      + `&& codex --remote ws://${localAddress}:${port}`
      + " --remote-auth-token-env CODEX_REMOTE_TOKEN\"";
    this.remoteProcess = remoteProcess;
    this.remoteCommand = remoteCommand;
    remoteProcess.once("close", () => {
      if (this.remoteProcess !== remoteProcess) return;
      this.remoteProcess = undefined;
      this.remoteCommand = undefined;
    });
    return remoteCommand;
  }

  private async executablePathRead() {
    const localAppDataPath = process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local");
    const installedCodexPath = join(localAppDataPath, "Programs", "OpenAI", "Codex", "bin", "codex.exe");
    try {
      await access(installedCodexPath);
      return installedCodexPath;
    } catch (error) {
      if (
        typeof error !== "object"
        || error === null
        || !("code" in error)
        || error.code !== "ENOENT"
      ) {
        throw error;
      }
    }
    return this.commandPathRead();
  }

  private async commandPathRead() {
    const command = "codex.cmd";
    return new Promise<string | undefined>((resolvePromise, rejectPromise) => {
      const commandProcess = spawn(command, ["--version"], {
        shell: command.toLowerCase().endsWith(".cmd"),
        stdio: "ignore",
        windowsHide: true,
      });
      commandProcess.once("error", (error) => {
        if ("code" in error && error.code === "ENOENT") {
          resolvePromise(undefined);
          return;
        }
        rejectPromise(error);
      });
      commandProcess.once("close", (exitCode) => {
        if (exitCode === 0) {
          resolvePromise(command);
          return;
        }
        rejectPromise(new Error(`${command} --version 执行失败，退出码：${String(exitCode)}`));
      });
    });
  }
}
