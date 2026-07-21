import { serve } from "@hono/node-server";
import { app as electronApp, BrowserWindow } from "electron";
import { join } from "node:path";
import adminPackage from "../../package.json";
import adminMainStore from "../store";
import MainBrowser from "./browser-window/main-browser";
import honoRoutersRead from "./hono";
import { bindAdminLoginReceivedEffect } from "../chatgptBrowser/admin-web-ipc";

const adminHono = adminMainStore.getState().runtimeConfig.hono;
const mainBrowser = new MainBrowser(`http://${adminHono.host}:${adminHono.port}`);

let adminServer: { close: () => void } | undefined;

export default function appLifecycleBind() {
  electronApp.setPath("userData", join(electronApp.getPath("appData"), adminPackage.name));

  electronApp.whenReady().then(async () => {
    adminMainStore.getState().chatgptBrowserActions.storedSessionCheck();
    bindAdminLoginReceivedEffect();
    const routers = await honoRoutersRead();
    adminServer = serve(
      {
        fetch: routers.fetch,
        hostname: adminHono.host,
        port: adminHono.port,
      },
      (serverInfo) => {
        console.log(`${adminPackage.name} hono listening on ${new URL(`http://${adminHono.host}:${serverInfo.port}`).toString()}`);
      },
    );
    mainBrowser.open();
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
