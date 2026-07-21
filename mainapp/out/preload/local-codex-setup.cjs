"use strict";
const electron = require("electron");
const localCodexSetupChannels = {
  setupAction: "local-codex-setup-action",
  setupState: "local-codex-setup-state",
  setupStateGet: "local-codex-setup-state-get"
};
const localCodexSetupBridge = {
  action(action) {
    return electron.ipcRenderer.invoke(localCodexSetupChannels.setupAction, action);
  },
  stateGet() {
    return electron.ipcRenderer.invoke(localCodexSetupChannels.setupStateGet);
  },
  stateSubscribe(listener) {
    const eventListener = (_event, state) => listener(state);
    electron.ipcRenderer.on(localCodexSetupChannels.setupState, eventListener);
    return () => electron.ipcRenderer.removeListener(localCodexSetupChannels.setupState, eventListener);
  }
};
electron.contextBridge.exposeInMainWorld("localCodexSetup", localCodexSetupBridge);
