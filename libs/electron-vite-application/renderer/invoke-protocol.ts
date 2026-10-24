import { ipcRenderer, BrowserWindow, IpcMainEvent, IpcRendererEvent } from "electron";
import Base, { type context_t as context_2 } from "invoke-protocol";
import { invokeprotocolKey } from "../declare";

export interface context_t extends context_2 {

}

export default class Producer extends Base<context_t> {
  public override async dispatchInit(inPreload?: boolean): Promise<void> {
    const ipc = inPreload ? ipcRenderer : window[invokeprotocolKey];
    const { close } = this.dispatchFromSendOn({
      sendUnknown: message => ipc.send(invokeprotocolKey, message),
      onUnknown: listener => {
        const onMessage = (_: IpcRendererEvent, message: unknown): void => {
          listener(message);
        }
        ipc.on(invokeprotocolKey, onMessage);
        return () => ipc.off(invokeprotocolKey, onMessage);
      },
      routeParam: operation => operation,
    });
    window.addEventListener("unload", close, { once: true });
  }

  public invokeProxyInit(browser: BrowserWindow) {
    if (browser.webContents.isDestroyed()) {
      throw new Error("Electron WebContents is destroyed");
    }
    const { invokeProxy, close } = this.invokeProxyFromSendOn(
      message => browser.webContents.send(invokeprotocolKey, message),
      listener => {
        const onMessage = (_event: IpcMainEvent, message: unknown): void => {
          listener(message);
        };
        browser.webContents.ipc.on(invokeprotocolKey, onMessage);
        return () => browser.webContents.ipc.off(invokeprotocolKey, onMessage);
      },
    );
    browser.webContents.once("destroyed", close);
    browser.webContents.once("render-process-gone", close);
    return invokeProxy;
  }
}