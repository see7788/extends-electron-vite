import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { app, BrowserWindow, dialog, Notification, screen } from "electron";
import electronUpdater from "electron-updater";

const { autoUpdater } = electronUpdater;
const updateCheckInterval = 5 * 60_000;
const updateWindowSize = { height: 124, width: 360 } as const;
const updateWindowMargin = 16;

type UpdateStatus = Readonly<{
  complete: boolean;
  percent: number;
  text: string;
  version: string;
}>;

export type ElectronUpdateReady = Readonly<{
  deviceId: string;
  initialUrl?: string;
  notify(text: string): void;
  userId: string;
}>;

const updateWindowHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'"
  >
  <style>
    * {
      box-sizing: border-box;
    }

    html,
    body {
      width: 100%;
      height: 100%;
      margin: 0;
    }

    body {
      background: #ffffff;
      color: #16181d;
      font: 14px "Segoe UI", sans-serif;
    }

    main {
      height: 100%;
      border: 1px solid #cfd4dc;
      padding: 16px;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    strong,
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    output {
      color: #1d62d8;
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }

    p {
      margin: 10px 0 12px;
      color: #4b5360;
    }

    .track {
      height: 7px;
      overflow: hidden;
      background: #e5e8ed;
      border-radius: 4px;
    }

    .bar {
      width: 0;
      height: 100%;
      background: #2878e3;
      border-radius: inherit;
      transition: width 160ms linear;
    }

    body.complete output,
    body.complete p {
      color: #177245;
    }

    body.complete .bar {
      background: #23875a;
    }
  </style>
</head>
<body>
  <main>
    <header>
      <strong id="title"></strong>
      <output id="percent"></output>
    </header>
    <p id="text"></p>
    <div class="track">
      <div class="bar" id="bar"></div>
    </div>
  </main>
  <script>
    globalThis.updateStatusRender = status => {
      document.body.classList.toggle("complete", status.complete);
      document.getElementById("title").textContent = status.title;
      document.getElementById("percent").textContent = status.percent + "%";
      document.getElementById("text").textContent = status.text;
      document.getElementById("bar").style.width = status.percent + "%";
    };
  </script>
</body>
</html>`;

const updaterState: {
  checkTimer?: NodeJS.Timeout;
  checking: boolean;
  installReady: boolean;
  installStarted: boolean;
  started: boolean;
} = {
  checking: false,
  installReady: false,
  installStarted: false,
  started: false,
};
const updateWindowState: {
  status?: UpdateStatus;
  window?: BrowserWindow;
} = {};

let fatalErrorReported = false;
let readyPromise: Promise<ElectronUpdateReady> | undefined;

const errorTextRead = (error: unknown) => error instanceof Error
  ? error.stack ?? error.message
  : String(error);

const fatalErrorReport = (error: unknown) => {
  if (fatalErrorReported) return;
  fatalErrorReported = true;

  const message = errorTextRead(error);
  console.error(message);
  dialog.showErrorBox(`${app.name} 主进程错误`, message);
  app.exit(1);
};

const applicationWindowTitleManage = (window: BrowserWindow) => {
  const applicationTitleApply = () => window.setTitle(`${app.name} ${app.getVersion()}`);
  applicationTitleApply();
  window.on("page-title-updated", event => {
    event.preventDefault();
    applicationTitleApply();
  });
};

const applicationWindowFind = () => BrowserWindow.getAllWindows().find(window => (
  window !== updateWindowState.window && !window.isDestroyed()
));

const applicationWindowFocus = () => {
  const window = applicationWindowFind();
  if (!window) return;
  if (window.isMinimized()) window.restore();
  window.show();
  window.focus();
};

const launchUrlFind = (args: string[]) => args.find(value => /^https?:\/\//i.test(value));

const launchUrlOpen = (url: string) => {
  const window = applicationWindowFind();
  if (!window) return;
  void window.loadURL(url).catch(error => console.error("Electron browser URL failed", error));
};

const commandOutputRead = (command: string, args: string[]) => {
  try {
    return execFileSync(command, args, { encoding: "utf8", windowsHide: true }).trim();
  } catch {
    return undefined;
  }
};

const systemDeviceSeedRead = () => {
  if (process.platform === "win32") {
    const output = commandOutputRead("reg.exe", [
      "query",
      "HKLM\\SOFTWARE\\Microsoft\\Cryptography",
      "/v",
      "MachineGuid",
    ]);
    return output?.match(/MachineGuid\s+REG_\w+\s+(.+)$/im)?.[1]?.trim();
  }
  if (process.platform === "darwin") {
    return commandOutputRead("ioreg", ["-rd1", "-c", "IOPlatformExpertDevice"])
      ?.match(/"IOPlatformUUID"\s*=\s*"([^"]+)"/)?.[1];
  }
  for (const path of ["/etc/machine-id", "/var/lib/dbus/machine-id"]) {
    if (existsSync(path)) return readFileSync(path, "utf8").trim();
  }
  return undefined;
};

const persistedIdGetOrCreate = (name: string) => {
  const path = join(app.getPath("userData"), name);
  if (existsSync(path)) return readFileSync(path, "utf8").trim();

  const id = randomUUID();
  writeFileSync(path, `${id}\n`, "utf8");
  return id;
};

const deviceIdRead = () => {
  const seed = systemDeviceSeedRead() ?? persistedIdGetOrCreate(".device-id");
  return createHash("sha256").update(`${app.name}\0${seed}`).digest("hex");
};

const updateWindowRender = () => {
  const { status, window } = updateWindowState;
  if (!status || !window || window.isDestroyed()) return;

  const viewModel = {
    ...status,
    percent: Math.round(status.percent),
    title: `${app.name} ${status.version}`,
  };
  void window.webContents
    .executeJavaScript(`globalThis.updateStatusRender?.(${JSON.stringify(viewModel)})`)
    .catch(error => console.error("Electron update status failed", error));
};

const updateWindowCreate = () => {
  const owner = applicationWindowFind();
  const display = owner
    ? screen.getDisplayMatching(owner.getBounds())
    : screen.getPrimaryDisplay();
  const { x, y, width, height } = display.workArea;
  const window = new BrowserWindow({
    alwaysOnTop: true,
    backgroundColor: "#ffffff",
    closable: false,
    focusable: false,
    frame: false,
    height: updateWindowSize.height,
    maximizable: false,
    minimizable: false,
    parent: owner,
    resizable: false,
    show: false,
    skipTaskbar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    width: updateWindowSize.width,
    x: x + width - updateWindowSize.width - updateWindowMargin,
    y: y + height - updateWindowSize.height - updateWindowMargin,
  });
  updateWindowState.window = window;

  window.setAlwaysOnTop(true, "floating");
  window.on("closed", () => {
    if (updateWindowState.window === window) updateWindowState.window = undefined;
  });
  owner?.once("closed", () => {
    if (!window.isDestroyed()) window.destroy();
  });
  window.webContents.on("did-finish-load", () => {
    updateWindowRender();
    window.showInactive();
  });
  void window.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(updateWindowHtml)}`);
};

const updateWindowShow = (status: UpdateStatus) => {
  updateWindowState.status = status;
  if (!updateWindowState.window || updateWindowState.window.isDestroyed()) {
    updateWindowCreate();
    return;
  }
  updateWindowRender();
};

const updateWindowClose = () => {
  updateWindowState.status = undefined;
  const window = updateWindowState.window;
  if (window && !window.isDestroyed()) window.destroy();
  updateWindowState.window = undefined;
};

const taskbarProgressClear = () => applicationWindowFind()?.setProgressBar(-1);

const notificationShow = (text: string) => {
  if (!Notification.isSupported()) {
    console.info(text);
    return;
  }
  const icon = app.isPackaged
    ? join(process.resourcesPath, "icon-activity.png")
    : join(app.getAppPath(), "resources", "icon-activity.png");
  new Notification({ title: app.name, body: text, icon }).show();
};

const notify = (text: string): void => {
  if (app.isReady()) notificationShow(text);
  else void app.whenReady().then(() => notificationShow(text));
};

const updateCheck = () => {
  if (updaterState.checking) return;
  updaterState.checking = true;
  void autoUpdater.checkForUpdates().catch(error => {
    updaterState.checking = false;
    taskbarProgressClear();
    console.error("Electron update check failed", error);
  });
};

const updateCheckTimerStart = () => {
  if (updaterState.checkTimer) return;
  updaterState.checkTimer = setInterval(updateCheck, updateCheckInterval);
  updaterState.checkTimer.unref();
};

const updateCheckTimerStop = () => {
  if (!updaterState.checkTimer) return;
  clearInterval(updaterState.checkTimer);
  updaterState.checkTimer = undefined;
};

const updateErrorHandle = (error: Error) => {
  updaterState.checking = false;
  updaterState.installReady = false;
  updateCheckTimerStart();
  updateWindowClose();
  taskbarProgressClear();
  console.error("Electron update failed", error);
};

const updateAvailableHandle = (version: string) => {
  updaterState.checking = false;
  updaterState.installReady = false;
  updateCheckTimerStop();
  updateWindowShow({
    complete: false,
    percent: 0,
    text: "正在下载更新",
    version,
  });
};

const updateNotAvailableHandle = () => {
  updaterState.checking = false;
  taskbarProgressClear();
};

const updateDownloadProgressHandle = (percentValue: number) => {
  const percent = Math.max(0, Math.min(100, percentValue));
  applicationWindowFind()?.setProgressBar(percent / 100);
  updateWindowShow({
    complete: false,
    percent,
    text: "正在下载更新",
    version: updateWindowState.status?.version ?? "",
  });
};

const updateDownloadedHandle = (version: string) => {
  if (updaterState.checkTimer) clearInterval(updaterState.checkTimer);
  updaterState.installReady = true;
  taskbarProgressClear();
  updateWindowShow({
    complete: true,
    percent: 100,
    text: "下载完成，退出软件后自动安装",
    version,
  });
};

const autoUpdaterStart = () => {
  if (updaterState.started) return;
  updaterState.started = true;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = process.platform !== "win32";
  autoUpdater.autoRunAppAfterInstall = false;
  autoUpdater.disableWebInstaller = true;

  autoUpdater.on("error", updateErrorHandle);
  autoUpdater.on("update-available", info => updateAvailableHandle(info.version));
  autoUpdater.on("update-not-available", updateNotAvailableHandle);
  autoUpdater.on("download-progress", progress => updateDownloadProgressHandle(progress.percent));
  autoUpdater.once("update-downloaded", info => updateDownloadedHandle(info.version));

  updateCheckTimerStart();
  updateCheck();
};

const applicationReady = async (): Promise<ElectronUpdateReady> => {
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    await new Promise<never>(() => undefined);
  }

  app.on("second-instance", (_event, argv) => {
    applicationWindowFocus();
    const url = launchUrlFind(argv);
    if (url) launchUrlOpen(url);
  });
  await app.whenReady();

  if (applicationWindowFind()) autoUpdaterStart();
  else app.once("browser-window-created", autoUpdaterStart);

  return {
    deviceId: deviceIdRead(),
    initialUrl: launchUrlFind(process.argv),
    notify,
    userId: persistedIdGetOrCreate(".user-id"),
  };
};

const applicationLifecycleRegister = () => {
  process.on("uncaughtException", fatalErrorReport);
  process.on("unhandledRejection", fatalErrorReport);
  app.on("browser-window-created", (_event, window) => applicationWindowTitleManage(window));
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
  app.on("before-quit", event => {
    if (
      process.platform !== "win32"
      || !updaterState.installReady
      || updaterState.installStarted
    ) return;
    event.preventDefault();
    updaterState.installStarted = true;
    updateWindowClose();
    autoUpdater.quitAndInstall(false, false);
  });
};

applicationLifecycleRegister();

export default async function electronUpdate(): Promise<ElectronUpdateReady> {
  readyPromise ??= applicationReady();
  return readyPromise;
}
