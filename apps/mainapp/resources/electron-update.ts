import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { app, BrowserWindow, dialog, Notification } from "electron";
import electronUpdater from "electron-updater";

const { autoUpdater } = electronUpdater;
const installDelay = 3_000;

export type ElectronUpdateReady = Readonly<{
  appName: string;
  appVersion: string;
  arch: string;
  deviceId: string;
  executablePath: string;
  initialUrl?: string;
  isPackaged: boolean;
  notify(text: string): void;
  platform: NodeJS.Platform;
  userId: string;
  userDataPath: string;
}>;

let readyPromise: Promise<ElectronUpdateReady> | undefined;
let updateStarted = false;
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
  const titleApply = () => window.setTitle(app.name);
  titleApply();
  window.on("page-title-updated", event => {
    event.preventDefault();
    titleApply();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const windowGet = () => BrowserWindow.getAllWindows().find(window => !window.isDestroyed());

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

const updateInstall = (version: string) => {
  progressClear();
  notify(`新版本 ${version} 已下载完成，3 秒后自动重启安装`);
  setTimeout(() => autoUpdater.quitAndInstall(false, true), installDelay);
};

const updateStart = () => {
  if (updateStarted) return;
  updateStarted = true;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.disableWebInstaller = true;
  autoUpdater.on("error", error => {
    progressClear();
    console.error("Electron update failed", error);
  });
  autoUpdater.on("update-available", info => {
    notify(`发现新版本 ${info.version}，正在下载更新`);
  });
  autoUpdater.on("update-not-available", progressClear);
  autoUpdater.on("download-progress", progress => {
    windowGet()?.setProgressBar(Math.max(0, Math.min(1, progress.percent / 100)));
  });
  autoUpdater.once("update-downloaded", info => updateInstall(info.version));
  void autoUpdater.checkForUpdates().catch(error => {
    progressClear();
    console.error("Electron update check failed", error);
  });
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
    appName: app.name,
    appVersion: app.getVersion(),
    arch: process.arch,
    deviceId: deviceIdRead(),
    executablePath: process.execPath,
    initialUrl: urlRead(process.argv),
    isPackaged: app.isPackaged,
    notify,
    platform: process.platform,
    userId: persistedIdRead(".user-id"),
    userDataPath: app.getPath("userData"),
  };
};

export default async function electronUpdate(): Promise<ElectronUpdateReady> {
  readyPromise ??= ready();
  return readyPromise;
}
