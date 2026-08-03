import { app as electronApp, BrowserWindow } from "electron";
import { honoServer } from "electron-vite-config-lib/rendererHonoReactPlugin/hono";
import { join } from "node:path";
import adminPackage from "../../package.json";
import adminMainStore from "../store";
import MainBrowser from "./browser-window/main-browser";
import honoRoutersRead from "./hono";
import { bindAdminLoginReceivedEffect } from "../chatgptBrowser/admin-web-ipc";

let adminServer: ReturnType<typeof honoServer> | undefined;
const mainBrowser = new MainBrowser();

export default function appLifecycleBind() {
  electronApp.setPath("userData", join(electronApp.getPath("appData"), adminPackage.name));

  electronApp.whenReady().then(async () => {
    adminMainStore.getState().chatgptBrowserActions.storedSessionCheck();
    bindAdminLoginReceivedEffect();
    const routers = await honoRoutersRead();
    adminServer = honoServer(routers);
    adminServer.once("listening", () => mainBrowser.open());
  });

  electronApp.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) mainBrowser.open();
  });

  electronApp.on("window-all-closed", () => {
    if (process.platform !== "darwin") electronApp.quit();
  });

  electronApp.on("before-quit", () => {
    adminServer?.close();
  });
}

appLifecycleBind();
