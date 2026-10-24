import type { IpcRenderer } from "electron";
import "./globalThis"
declare global {
  interface Window {
    readonly invokeprotocol: IpcRenderer;
  }
  var invokeprotocolKey: "invokeprotocol"
}
export declare const invokeprotocolKey: "invokeprotocol"
