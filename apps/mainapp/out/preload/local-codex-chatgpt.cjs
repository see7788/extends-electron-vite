let electron = require("electron");
//#region ../../libs/chatgpt-com-tocodex/chatgpt/local-codex-chatgpt/protocol.ts
var localCodexChatGptChannels = { pageEvent: "local-codex-page-event" };
//#endregion
//#region ../../libs/chatgpt-com-tocodex/chatgpt/local-codex-chatgpt/index.tsx
electron.contextBridge.exposeInMainWorld("localCodexPageEvent", { report(payload) {
	if (typeof payload !== "string") throw new TypeError("Local Codex page event payload must be a string");
	electron.ipcRenderer.send(localCodexChatGptChannels.pageEvent, payload);
} });
//#endregion
