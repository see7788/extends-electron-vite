import { app, BrowserWindow, dialog } from "electron";
import { Hono } from "hono";
import { honoServer, honoUrl } from "electron-vite-config-lib/mainPlugin/hono";
import preloadPath from "electron-vite-config-lib/preloadCreate/electron";
import electronUpdate from "../resources/electron-update";
import ElectronMainCommunication from "electron-invoke-protocol/main";

const routers = new Hono().get("/health", context => context.json({ ok: true }));


void electronUpdate().then(({ initialUrl }) => {
  const server = honoServer(routers);
  server.once("listening", () => {
    const mainWindow = new BrowserWindow({
      webPreferences: {
        preload: preloadPath("__PACKAGE_NAME__-preload"),
      },
    });
    const communication = new ElectronMainCommunication()
      .browserWindow(mainWindow)
      .app(app)
      .dialog(dialog);
    void communication.dispatchInit({ webContents: mainWindow.webContents });
    void mainWindow.loadURL(initialUrl ?? honoUrl("__PACKAGE_NAME__-renderer"));
  });
});
