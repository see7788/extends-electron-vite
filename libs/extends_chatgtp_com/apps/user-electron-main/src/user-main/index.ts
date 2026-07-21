import { app, BrowserWindow, clipboard, ipcMain, screen } from "electron";
import userMainStore, { type McpToolCallResult } from "./store";

function mcpToolCall(name: string): McpToolCallResult {
  if (name === "app.info") {
    return {
      content: JSON.stringify(
        {
          name: app.getName(),
          version: app.getVersion(),
          platform: process.platform,
          userData: app.getPath("userData"),
        },
        null,
        2,
      ),
    };
  }

  if (name === "time.now") {
    return { content: new Date().toISOString() };
  }

  if (name === "clipboard.read") {
    return { content: clipboard.readText() };
  }

  if (name === "screen.info") {
    return {
      content: JSON.stringify(
        {
          primaryDisplay: screen.getPrimaryDisplay(),
          displays: screen.getAllDisplays(),
        },
        null,
        2,
      ),
    };
  }

  throw new Error(`MCP tool not found: ${name}`);
}

function hostWindowCreate() {
  userMainStore.hostWindow = new BrowserWindow({
    width: 1320,
    height: 860,
    title: "ChatGPT ZNTD User",
    webPreferences: {
      preload: userMainStore.hostPreloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
    },
  });

  userMainStore.hostWindow.webContents.setWindowOpenHandler(({ url }) => {
    userMainStore.hostWindow?.loadURL(url);
    return { action: "deny" };
  });

  userMainStore.hostWindow.loadURL(userMainStore.userWebUrl);
}

function appReady() {
  hostWindowCreate();
}

function ipcBind() {
  ipcMain.handle("zntd-user-mcp-tools-list", () => userMainStore.mcpTools);
  ipcMain.handle("zntd-user-mcp-tool-call", (_event, name: string) => mcpToolCall(name));
}

function appActivate() {
  if (!userMainStore.hostWindow || userMainStore.hostWindow.isDestroyed()) hostWindowCreate();
}

function windowAllClosed() {
  if (process.platform !== "darwin") app.quit();
}

function appLifecycleBind() {
  ipcBind();
  app.whenReady().then(appReady);
  app.on("activate", appActivate);
  app.on("window-all-closed", windowAllClosed);
}

export default {
  appLifecycleBind,
};
