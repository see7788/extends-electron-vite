"use strict";
const electron = require("electron");
const userBridge = {
  mcpToolsList: () => electron.ipcRenderer.invoke("zntd-user-mcp-tools-list"),
  mcpToolCall: (name) => electron.ipcRenderer.invoke("zntd-user-mcp-tool-call", name)
};
electron.contextBridge.exposeInMainWorld("zntdElectron", userBridge);
