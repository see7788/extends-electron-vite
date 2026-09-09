import { app, BrowserWindow, dialog } from "electron";
import { Hono } from "hono";
import { ElectronMainCommunication } from "electron-ipc/main";
import { honoServer, honoUrl } from "electron-vite-config-lib/mainPlugin/hono";
import preloadPath from "electron-vite-config-lib/preloadCreate/electron";
import electronUpdate from "../resources/electron-update";

const routers = new Hono().get("/health", context => context.json({ ok: true }));

let mainWindow: BrowserWindow | undefined;
let communication: ElectronMainCommunication | undefined;

void electronUpdate().then(({ initialUrl }) => {
  const server = honoServer(routers);
  server.once("listening", () => {
    mainWindow = new BrowserWindow({
      webPreferences: {
        preload: preloadPath("__PACKAGE_NAME__-preload"),
      },
    });
    communication = new ElectronMainCommunication({
      webContents: mainWindow.webContents,
      context: {
        zodCatch: ({ error, route }) => ({
          code: "INVALID_INPUT",
          route,
          issues: error.issues,
        }),
      },
    })
      .browserWindow(mainWindow)
      .app(app)
      .dialog(dialog);
    void mainWindow.loadURL(initialUrl ?? honoUrl("__PACKAGE_NAME__-renderer"));
  });
});
