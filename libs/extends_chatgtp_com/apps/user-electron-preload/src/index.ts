import { contextBridge, ipcRenderer } from "electron";
import type { ElectronUserBridge } from "./types";

const mcpBridge: ElectronUserBridge = {
  mcpToolsList: () => ipcRenderer.invoke("zntd-user-mcp-tools-list"),
  mcpToolCall: (name) => ipcRenderer.invoke("zntd-user-mcp-tool-call", name),
};

contextBridge.exposeInMainWorld("zntdElectron", mcpBridge);
