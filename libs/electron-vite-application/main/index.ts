import { BrowserWindow } from "electron";
import { Hono } from "hono";
import { honoServer, honoUrl } from "electron-vite-config-lib/mainPlugin/hono";
import preloadPath from "electron-vite-config-lib/preloadCreate/electron";
import electronUpdate from "../resources/electron-update";
import protocol from "./invoke-protocol";

const routers = new Hono().get("/health", context => context.json({ ok: true }));
void electronUpdate().then(({ initialUrl }) => {
  const server = honoServer(routers);
  server.once("listening", () => {
    const mainWindow = new BrowserWindow({
      webPreferences: {
        preload: preloadPath("preload"),
      },
    });
    void protocol.dispatchInit({ browser: mainWindow }).then(() => {
      void mainWindow.loadURL(initialUrl ?? honoUrl("renderer"));
    });
  });
});