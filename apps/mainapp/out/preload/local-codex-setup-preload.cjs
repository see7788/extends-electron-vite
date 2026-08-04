let electron = require("electron");
//#region ../../libs/chatgpt-com-tocodex/chatgpt/main.browserWindow/protocol.ts
var localCodexSetupChannels = {
	setupAction: "local-codex-setup-action",
	setupState: "local-codex-setup-state",
	setupStateGet: "local-codex-setup-state-get"
};
//#endregion
//#region ../../libs/chatgpt-com-tocodex/chatgpt/main.browserWindow/setup/local-codex-setup-preload/index.tsx
electron.contextBridge.exposeInMainWorld("localCodexSetup", {
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
});
//#endregion
