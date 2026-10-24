import { contextBridge, ipcRenderer } from "electron";
import { invokeprotocolKey } from "../declare";

contextBridge.exposeInMainWorld(invokeprotocolKey, ipcRenderer);
