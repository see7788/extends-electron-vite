import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { join } from "node:path";
import honoappStore from "honoapp/src/store";
import * as vscode from "vscode";

const serviceRuntime = honoappStore.getState().runtimeActions;
const serviceOrigin = `http://${serviceRuntime.hostname}:${serviceRuntime.port}`;
type ServiceState = "starting" | "running";

class StatusViewProvider implements vscode.TreeDataProvider<string> {
  private readonly changeEmitter = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this.changeEmitter.event;
  private state: ServiceState = "starting";

  constructor(private readonly mcpOrigin: string) {}

  stateSet(state: ServiceState) {
    this.state = state;
    this.changeEmitter.fire();
  }

  getChildren() {
    return ["service"];
  }

  getTreeItem() {
    const pending = this.state === "starting";
    const running = this.state === "running";
    const item = new vscode.TreeItem(
      this.mcpOrigin,
      vscode.TreeItemCollapsibleState.None,
    );
    item.command = pending ? undefined : { command: "extendsCodex.serviceOpen", title: "打开 extends-codex" };
    item.iconPath = new vscode.ThemeIcon(
      pending ? "loading~spin" : "server-process",
      new vscode.ThemeColor(pending ? "foreground" : "testing.iconPassed"),
    );
    return item;
  }
}

class ServiceController {
  private state: ServiceState = "starting";

  constructor(
    private readonly extensionPath: string,
    private readonly output: vscode.OutputChannel,
    private readonly stateChange: (state: ServiceState) => void,
  ) {}

  get stateGet() {
    return this.state;
  }

  /** 插件激活时确保本机唯一的 Hono 服务已经运行。 */
  async start() {
    this.stateSet("starting");
    if (await this.portIdleRead()) {
      this.serviceProcessStart();
      await this.portOccupiedWait();
    }
    this.stateSet("running");
    return this;
  }

  async open() {
    await vscode.env.openExternal(vscode.Uri.parse(serviceOrigin));
    return this;
  }

  private portIdleRead() {
    return new Promise<boolean>((resolve, reject) => {
      const server = createServer();
      server.once("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE") resolve(false);
        else reject(error);
      });
      server.once("listening", () => {
        server.close(error => error ? reject(error) : resolve(true));
      });
      server.listen(serviceRuntime.port, serviceRuntime.hostname);
    });
  }

  private serviceProcessStart() {
    const servicePath = join(this.extensionPath, "dist", "honoapp", "index.js");
    const serviceProcess = spawn(process.execPath, [servicePath], {
      cwd: this.extensionPath,
      detached: true,
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: "1",
        NODE_ENV: "production",
      },
      stdio: "ignore",
      windowsHide: true,
    });
    serviceProcess.once("error", error => this.output.appendLine(error.stack ?? error.message));
    serviceProcess.unref();
  }

  private async portOccupiedWait() {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      if (!(await this.portIdleRead())) return;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(`extends-codex 未能占用 ${serviceOrigin}`);
  }

  private stateSet(state: ServiceState) {
    this.state = state;
    this.stateChange(state);
  }
}

// 以后如需恢复由插件控制独立 Chrome 窗口，可启用以下实现。
// const browserProfilePath = vscode.Uri.joinPath(context.globalStorageUri, "chrome-profile").fsPath;
// const browserProcess = browserProcessStart({ origin: serviceOrigin, profilePath: browserProfilePath });
//
// function browserProcessStart(input: { origin: string; profilePath: string }) {
//   const chromePath = chromePathGet();
//   if (!chromePath) throw new Error("未找到 Google Chrome。");
//   return spawn(chromePath, [
//     `--app=${input.origin}`,
//     `--user-data-dir=${input.profilePath}`,
//     "--no-default-browser-check",
//     "--no-first-run",
//   ], { stdio: "ignore", windowsHide: true });
// }
//
// function chromePathGet() {
//   const candidates = process.platform === "win32"
//     ? [
//       process.env.PROGRAMFILES && `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
//       process.env["PROGRAMFILES(X86)"] && `${process.env["PROGRAMFILES(X86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
//       process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
//     ]
//     : process.platform === "darwin"
//       ? ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]
//       : ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable"];
//   return candidates.find(path => typeof path === "string" && existsSync(path));
// }
//
// function browserProcessStop(browserProcess: ChildProcess | undefined) {
//   if (!browserProcess || browserProcess.exitCode !== null || browserProcess.pid === undefined) return Promise.resolve();
//   if (process.platform !== "win32") {
//     browserProcess.kill("SIGTERM");
//     return new Promise<void>(resolve => browserProcess.once("exit", () => resolve()));
//   }
//   return new Promise<void>(resolve => {
//     const taskkill = spawn("taskkill.exe", ["/PID", String(browserProcess.pid), "/T", "/F"], {
//       stdio: "ignore",
//       windowsHide: true,
//     });
//     taskkill.once("exit", () => resolve());
//     taskkill.once("error", () => resolve());
//   });
// }

export async function activate(context: vscode.ExtensionContext) {
  const output = vscode.window.createOutputChannel("extends-codex");
  const workspaceName = vscode.workspace.name;
  const statusProvider = new StatusViewProvider(
    workspaceName ? `${serviceOrigin}/mcp/${encodeURIComponent(workspaceName)}` : `${serviceOrigin}/mcp`,
  );
  const statusRender = (state: ServiceState) => {
    statusProvider.stateSet(state);
  };
  const service = new ServiceController(context.extensionPath, output, statusRender);
  statusRender(service.stateGet);
  const statusView = vscode.window.createTreeView("extendsCodex.status", { treeDataProvider: statusProvider });
  context.subscriptions.push(
    output,
    statusView,
    vscode.commands.registerCommand("extendsCodex.serviceOpen", () => service.open()),
  );
  await service.start();
}

export function deactivate() {
  return undefined;
}
