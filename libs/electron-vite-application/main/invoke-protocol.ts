import { BrowserWindow, ipcRenderer, IpcMainInvokeEvent } from "electron";
import Base, { type context_t as context_2 } from "invoke-protocol";
import { invokeprotocolKey } from "../declare";

export interface context_t extends context_2 {
  readonly browser: BrowserWindow;
  readonly event: IpcMainInvokeEvent;
}

export default class Producer extends Base<context_t> {
  public override async dispatchInit(
    browser: context_t["browser"],
  ) {
    browser.webContents.ipc.handle(
      invokeprotocolKey,
      (event, operation: Pick<context_t, "path" | "input">) =>
        this.dispatchRoute({ ...operation, browser, event }),
    )
  }

  public invokeProxyInit(inPreload?:boolean) {
    const ipc = inPreload ? ipcRenderer : window[invokeprotocolKey];
    return this.invokeProxyInitFromInvoke(arg => ipc.invoke(invokeprotocolKey, arg))
  }
}
