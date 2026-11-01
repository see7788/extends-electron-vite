import { contextBridge, ipcRenderer } from "electron";
import { invokeprotocolKey, type InvokeProtocolBridge } from "./declare";

const listeners = new Map<(...args: readonly unknown[]) => void, (...args: readonly unknown[]) => void>();
const bridge: InvokeProtocolBridge = {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  on: (channel, listener) => {
    const wrapped = (...args: unknown[]) => listener(...args.slice(1));
    listeners.set(listener, wrapped);
    ipcRenderer.on(channel, wrapped);
  },
  off: (channel, listener) => {
    const wrapped = listeners.get(listener);
    if (!wrapped) return;
    ipcRenderer.off(channel, wrapped);
    listeners.delete(listener);
  },
};

contextBridge.exposeInMainWorld(invokeprotocolKey, bridge);
