"use strict";
const electron = require("electron");
const node_path = require("node:path");
const config = { "userWebUrl": "http://127.0.0.1:8788/user-web/" };
const userPackage = {
  config
};
const rootDir = node_path.join(__dirname, "..", "..", "..", "..", "..");
const userMainStore = {
  hostPreloadPath: node_path.join(rootDir, "apps", "user-electron-preload", "out", "index.js"),
  hostWindow: void 0,
  userWebUrl: userPackage.config.userWebUrl,
  mcpTools: [
    {
      name: "app.info",
      description: "读取 User 壳信息"
    },
    {
      name: "time.now",
      description: "读取当前本机时间"
    },
    {
      name: "clipboard.read",
      description: "读取当前剪贴板文本"
    },
    {
      name: "screen.info",
      description: "读取当前屏幕信息"
    }
  ]
};
function mcpToolCall(name) {
  if (name === "app.info") {
    return {
      content: JSON.stringify(
        {
          name: electron.app.getName(),
          version: electron.app.getVersion(),
          platform: process.platform,
          userData: electron.app.getPath("userData")
        },
        null,
        2
      )
    };
  }
  if (name === "time.now") {
    return { content: (/* @__PURE__ */ new Date()).toISOString() };
  }
  if (name === "clipboard.read") {
    return { content: electron.clipboard.readText() };
  }
  if (name === "screen.info") {
    return {
      content: JSON.stringify(
        {
          primaryDisplay: electron.screen.getPrimaryDisplay(),
          displays: electron.screen.getAllDisplays()
        },
        null,
        2
      )
    };
  }
  throw new Error(`MCP tool not found: ${name}`);
}
function hostWindowCreate() {
  userMainStore.hostWindow = new electron.BrowserWindow({
    width: 1320,
    height: 860,
    title: "ChatGPT ZNTD User",
    webPreferences: {
      preload: userMainStore.hostPreloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true
    }
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
  electron.ipcMain.handle("zntd-user-mcp-tools-list", () => userMainStore.mcpTools);
  electron.ipcMain.handle("zntd-user-mcp-tool-call", (_event, name) => mcpToolCall(name));
}
function appActivate() {
  if (!userMainStore.hostWindow || userMainStore.hostWindow.isDestroyed()) hostWindowCreate();
}
function windowAllClosed() {
  if (process.platform !== "darwin") electron.app.quit();
}
function appLifecycleBind() {
  ipcBind();
  electron.app.whenReady().then(appReady);
  electron.app.on("activate", appActivate);
  electron.app.on("window-all-closed", windowAllClosed);
}
const userMain = {
  appLifecycleBind
};
userMain.appLifecycleBind();
