import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { app, BrowserWindow, dialog, Notification, screen } from "electron";
import electronUpdater from "electron-updater";

const { autoUpdater } = electronUpdater;
const updateCheckInterval = 5 * 60_000;
const updateWindowWidth = 360;
const updateWindowHeight = 124;
const updateWindowMargin = 16;

type UpdateStatus = Readonly<{
  complete: boolean;
  percent: number;
  text: string;
  version: string;
}>;

const updateWindowHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'">
  <style>
    * { box-sizing: border-box; }
    html, body { width: 100%; height: 100%; margin: 0; }
    body { background: #ffffff; color: #16181d; font: 14px "Segoe UI", sans-serif; }
    main { height: 100%; border: 1px solid #cfd4dc; padding: 16px; }
    header { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    output { color: #1d62d8; font-variant-numeric: tabular-nums; font-weight: 600; }
    p { margin: 10px 0 12px; color: #4b5360; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .track { height: 7px; overflow: hidden; background: #e5e8ed; border-radius: 4px; }
    .bar { height: 100%; width: 0; background: #2878e3; border-radius: inherit; transition: width 160ms linear; }
    body.complete output, body.complete p { color: #177245; }
    body.complete .bar { background: #23875a; }
  </style>
</head>
<body>
  <main>
    <header><strong id="title"></strong><output id="percent"></output></header>
    <p id="text"></p>
    <div class="track"><div class="bar" id="bar"></div></div>
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

export type ElectronUpdateReady = Readonly<{
  deviceId: string;
  initialUrl?: string;
  notify(text: string): void;
  userId: string;
}>;

let readyPromise: Promise<ElectronUpdateReady> | undefined;
let updateStarted = false;
let updateChecking = false;
let updateCheckTimer: NodeJS.Timeout | undefined;
let updateInstallReady = false;
let updateInstallStarted = false;
let updateStatus: UpdateStatus | undefined;
let updateWindow: BrowserWindow | undefined;
let fatalErrorReported = false;

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

process.on("uncaughtException", fatalErrorReport);
process.on("unhandledRejection", fatalErrorReport);
app.on("browser-window-created", (_event, window) => {
  const titleApply = () => window.setTitle(`${app.name} ${app.getVersion()}`);
  titleApply();
  window.on("page-title-updated", event => {
    event.preventDefault();
    titleApply();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const windowGet = () => BrowserWindow.getAllWindows().find(window => (
  window !== updateWindow && !window.isDestroyed()
));

const windowFocus = () => {
  const window = windowGet();
  if (!window) return;
  if (window.isMinimized()) window.restore();
  window.show();
  window.focus();
};

const urlRead = (args: string[]) => args.find(value => /^https?:\/\//i.test(value));

const windowUrlOpen = (url: string) => {
  const window = windowGet();
  if (!window) return;
  void window.loadURL(url).catch(error => console.error("Electron browser URL failed", error));
};

const commandRead = (command: string, args: string[]) => {
  try {
    return execFileSync(command, args, { encoding: "utf8", windowsHide: true }).trim();
  } catch {
    return undefined;
  }
};

const systemDeviceSeedRead = () => {
  if (process.platform === "win32") {
    const output = commandRead("reg.exe", [
      "query",
      "HKLM\\SOFTWARE\\Microsoft\\Cryptography",
      "/v",
      "MachineGuid",
    ]);
    return output?.match(/MachineGuid\s+REG_\w+\s+(.+)$/im)?.[1]?.trim();
  }
  if (process.platform === "darwin") {
    return commandRead("ioreg", ["-rd1", "-c", "IOPlatformExpertDevice"])
      ?.match(/"IOPlatformUUID"\s*=\s*"([^"]+)"/)?.[1];
  }
  for (const path of ["/etc/machine-id", "/var/lib/dbus/machine-id"]) {
    if (existsSync(path)) return readFileSync(path, "utf8").trim();
  }
  return undefined;
};

const persistedIdRead = (name: string) => {
  const path = join(app.getPath("userData"), name);
  if (existsSync(path)) return readFileSync(path, "utf8").trim();
  const id = randomUUID();
  writeFileSync(path, `${id}\n`, "utf8");
  return id;
};

const deviceIdRead = () => {
  const seed = systemDeviceSeedRead() ?? persistedIdRead(".device-id");
  return createHash("sha256").update(`${app.name}\0${seed}`).digest("hex");
};

const updateWindowRender = () => {
  if (!updateStatus || !updateWindow || updateWindow.isDestroyed()) return;
  const status = {
    ...updateStatus,
    percent: Math.round(updateStatus.percent),
    title: `${app.name} ${updateStatus.version}`,
  };
  void updateWindow.webContents
    .executeJavaScript(`globalThis.updateStatusRender?.(${JSON.stringify(status)})`)
    .catch(error => console.error("Electron update status failed", error));
};

const updateWindowShow = (status: UpdateStatus) => {
  updateStatus = status;
  if (!updateWindow || updateWindow.isDestroyed()) {
    const owner = windowGet();
    const display = owner
      ? screen.getDisplayMatching(owner.getBounds())
      : screen.getPrimaryDisplay();
    const { x, y, width, height } = display.workArea;
    updateWindow = new BrowserWindow({
      alwaysOnTop: true,
      backgroundColor: "#ffffff",
      closable: false,
      focusable: false,
      frame: false,
      height: updateWindowHeight,
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
      width: updateWindowWidth,
      x: x + width - updateWindowWidth - updateWindowMargin,
      y: y + height - updateWindowHeight - updateWindowMargin,
    });
    const currentWindow = updateWindow;
    currentWindow.setAlwaysOnTop(true, "floating");
    currentWindow.on("closed", () => {
      if (updateWindow === currentWindow) updateWindow = undefined;
    });
    owner?.once("closed", () => {
      if (!currentWindow.isDestroyed()) currentWindow.destroy();
    });
    currentWindow.webContents.on("did-finish-load", () => {
      updateWindowRender();
      currentWindow.showInactive();
    });
    void currentWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(updateWindowHtml)}`);
    return;
  }
  updateWindowRender();
};

const updateWindowClose = () => {
  updateStatus = undefined;
  if (updateWindow && !updateWindow.isDestroyed()) updateWindow.destroy();
  updateWindow = undefined;
};

app.on("before-quit", event => {
  if (process.platform !== "win32" || !updateInstallReady || updateInstallStarted) return;
  event.preventDefault();
  updateInstallStarted = true;
  updateWindowClose();
  autoUpdater.quitAndInstall(false, false);
});

const progressClear = () => windowGet()?.setProgressBar(-1);

const notify = (text: string): void => {
  const show = () => {
    if (!Notification.isSupported()) {
      console.info(text);
      return;
    }
    const icon = app.isPackaged
      ? join(process.resourcesPath, "icon-activity.png")
      : join(app.getAppPath(), "resources", "icon-activity.png");
    new Notification({ title: app.name, body: text, icon }).show();
  };
  if (app.isReady()) show();
  else void app.whenReady().then(show);
};

const updateDownloaded = (version: string) => {
  if (updateCheckTimer) clearInterval(updateCheckTimer);
  updateInstallReady = true;
  progressClear();
  updateWindowShow({
    complete: true,
    percent: 100,
    text: "下载完成，退出软件后自动安装",
    version,
  });
};

const updateCheck = () => {
  if (updateChecking) return;
  updateChecking = true;
  void autoUpdater.checkForUpdates().catch(error => {
    updateChecking = false;
    progressClear();
    console.error("Electron update check failed", error);
  });
};

const updateCheckTimerStart = () => {
  if (updateCheckTimer) return;
  updateCheckTimer = setInterval(updateCheck, updateCheckInterval);
  updateCheckTimer.unref();
};

const updateCheckTimerStop = () => {
  if (!updateCheckTimer) return;
  clearInterval(updateCheckTimer);
  updateCheckTimer = undefined;
};

const updateStart = () => {
  if (updateStarted) return;
  updateStarted = true;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = process.platform !== "win32";
  autoUpdater.autoRunAppAfterInstall = false;
  autoUpdater.disableWebInstaller = true;
  autoUpdater.on("error", error => {
    updateChecking = false;
    updateInstallReady = false;
    updateCheckTimerStart();
    updateWindowClose();
    progressClear();
    console.error("Electron update failed", error);
  });
  autoUpdater.on("update-available", info => {
    updateChecking = false;
    updateInstallReady = false;
    updateCheckTimerStop();
    updateWindowShow({
      complete: false,
      percent: 0,
      text: "正在下载更新",
      version: info.version,
    });
  });
  autoUpdater.on("update-not-available", () => {
    updateChecking = false;
    progressClear();
  });
  autoUpdater.on("download-progress", progress => {
    const percent = Math.max(0, Math.min(100, progress.percent));
    windowGet()?.setProgressBar(percent / 100);
    updateWindowShow({
      complete: false,
      percent,
      text: "正在下载更新",
      version: updateStatus?.version ?? "",
    });
  });
  autoUpdater.once("update-downloaded", info => updateDownloaded(info.version));
  updateCheckTimerStart();
  updateCheck();
};

const ready = async (): Promise<ElectronUpdateReady> => {
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    await new Promise<never>(() => undefined);
  }

  app.on("second-instance", (_event, argv) => {
    windowFocus();
    const url = urlRead(argv);
    if (url) windowUrlOpen(url);
  });
  await app.whenReady();

  if (windowGet()) {
    updateStart();
  } else {
    app.once("browser-window-created", updateStart);
  }

  return {
    deviceId: deviceIdRead(),
    initialUrl: urlRead(process.argv),
    notify,
    userId: persistedIdRead(".user-id"),
  };
};

export default async function electronUpdate(): Promise<ElectronUpdateReady> {
  readyPromise ??= ready();
  return readyPromise;
}
