"use strict";
const electron = require("electron");
const localCodexChatGptChannels = {
  pageEvent: "local-codex-page-event"
};
const localCodexChatGptBridge = {
  report(payload) {
    if (typeof payload !== "string") throw new TypeError("Local Codex page event payload must be a string");
    electron.ipcRenderer.send(localCodexChatGptChannels.pageEvent, payload);
  }
};
electron.contextBridge.exposeInMainWorld("localCodexPageEvent", localCodexChatGptBridge);
