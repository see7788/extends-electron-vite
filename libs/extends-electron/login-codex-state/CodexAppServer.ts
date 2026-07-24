import type { ChildProcessWithoutNullStreams } from "node:child_process";
import { spawn } from "node:child_process";
import { createInterface, type Interface as ReadLineInterface } from "node:readline";

type AppServerMessage = {
  id?: number;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: unknown;
};

type AppServerMessageWaiter = {
  resolve(message: AppServerMessage): void;
  reject(error: unknown): void;
};

export default class CodexAppServer {
  constructor(private readonly executablePath: string) { }

  private isClosed = false;
  private messageId = 0;
  private outputLines: ReadLineInterface | undefined;
  private process: ChildProcessWithoutNullStreams | undefined;
  private readonly requestWaiters = new Map<number, AppServerMessageWaiter>();

  async connectionOpen() {
    this.process = spawn(this.executablePath, [
      "app-server",
      "-c",
      "cli_auth_credentials_store=\"file\"",
    ], {
      shell: this.executablePath.toLowerCase().endsWith(".cmd"),
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });
    this.outputLines = createInterface({ input: this.process.stdout });
    this.process.once("error", (error) => this.connectionClose(error));
    this.process.once("close", (exitCode, signal) => {
      this.connectionClose(new Error(
        `Codex App Server 已退出，退出码：${String(exitCode)}，信号：${String(signal)}`,
      ));
    });
    this.process.stdin.once("error", (error) => this.connectionClose(error));
    this.outputLines.on("line", (line) => this.messageReceive(line));

    const initializeMessage = await this.requestSend("initialize", {
      clientInfo: {
        name: "login_codex_state",
        title: "Login Codex State",
        version: "0.1.0",
      },
    });
    if (initializeMessage.error) {
      this.connectionClose();
      throw new Error("Codex App Server 初始化失败", {
        cause: initializeMessage.error,
      });
    }
    this.messageSend({ method: "initialized", params: {} });
  }

  readonly connectionClose = (error: unknown = new Error("Codex App Server 连接已关闭")) => {
    if (this.isClosed) return;
    this.isClosed = true;
    this.outputLines?.close();
    this.process?.kill();
    for (const waiter of this.requestWaiters.values()) waiter.reject(error);
    this.requestWaiters.clear();
  };

  async requestSend(method: string, params?: unknown, timeoutMilliseconds = 30000) {
    if (this.isClosed || !this.process) {
      throw new Error(`无法发送 ${method}：Codex App Server 未连接`);
    }
    const id = ++this.messageId;
    return new Promise<AppServerMessage>((resolvePromise, rejectPromise) => {
      const timeout = setTimeout(() => {
        this.requestWaiters.delete(id);
        rejectPromise(new Error(`Codex App Server 请求超时：${method}`));
      }, timeoutMilliseconds);
      this.requestWaiters.set(id, {
        resolve: (message) => {
          clearTimeout(timeout);
          resolvePromise(message);
        },
        reject: (error) => {
          clearTimeout(timeout);
          rejectPromise(error);
        },
      });
      this.messageSend({ id, method, params });
    });
  }

  private messageSend(message: AppServerMessage) {
    if (this.isClosed || !this.process) {
      throw new Error("无法写入消息：Codex App Server 未连接");
    }
    try {
      this.process.stdin.write(`${JSON.stringify(message)}\n`);
    } catch (error) {
      this.connectionClose(error);
      throw error;
    }
  }

  private messageReceive(line: string) {
    let message: AppServerMessage;
    try {
      message = JSON.parse(line) as AppServerMessage;
    } catch (error) {
      this.connectionClose(new Error("Codex App Server 返回了无效 JSON", {
        cause: error,
      }));
      return;
    }
    if (typeof message.id === "number") {
      const waiter = this.requestWaiters.get(message.id);
      if (!waiter) return;
      this.requestWaiters.delete(message.id);
      waiter.resolve(message);
    }
  }
}
