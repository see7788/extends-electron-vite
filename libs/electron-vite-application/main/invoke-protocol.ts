import type { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import Base, { type context_t as context_2 } from "invoke-protocol";

const invokeprotocolKey = "invokeprotocol" as const;

export interface context_t extends context_2 {
  readonly browser: BrowserWindow;
  readonly event: IpcMainInvokeEvent;
}

export default class Producer extends Base<context_t> {
  public override async dispatchInit(browser: context_t["browser"]): Promise<void> {
    browser.webContents.ipc.handle(
      invokeprotocolKey,
      (event, operation: Pick<context_t, "path" | "input">) =>
        this.dispatchRoute({ ...operation, browser, event }),
    );
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
