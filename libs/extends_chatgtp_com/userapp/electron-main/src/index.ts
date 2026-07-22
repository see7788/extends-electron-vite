import { app, BrowserWindow } from "electron";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import createViteRouter from "extends-hono/create-reactapp-router/index.ts";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const userAppWebName = "remoteweb";
const userAppBasePath = "/";
const userAppHost = "127.0.0.1";
const userAppApiPort = 8820;
const appsDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const preloadPath = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "electron-preload", "out", "index.js");
let hostWindow: BrowserWindow | undefined;

app.disableHardwareAcceleration();

function userAppWindowCreate() {
  const window = new BrowserWindow({
    width: 1300,
    height: 860,
    title: "UserApp Host",
    show: false,
    backgroundColor: "#111827",
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
    },
  });
  hostWindow = window;

  window.once("ready-to-show", () => {
    if (!window.isDestroyed()) window.show();
  });

  window.loadURL(`http://${userAppHost}:${userAppApiPort}${userAppBasePath}`);
}

app.whenReady().then(async () => {
  const userViteRouter = await createViteRouter({
    root: join(appsDir, userAppWebName),
    basePath: userAppBasePath,
  });
  const routers = new Hono().all(
    userAppBasePath,
    (context) => userViteRouter.fetch(context.req.raw)).all(`${userAppBasePath}*`, (context) =>
      userViteRouter.fetch(context.req.raw),
    );

  serve(
    {
      fetch: routers.fetch,
      hostname: userAppHost,
      port: userAppApiPort,
    },
  );
  userAppWindowCreate();
});

app.on("activate", () => {
  if (!hostWindow || hostWindow.isDestroyed()) userAppWindowCreate();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
