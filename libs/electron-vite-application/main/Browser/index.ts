import { BrowserWindow } from "electron";
import { honoUrl, preloadPath } from "../declare";
import dispatchInit from "./invoke-protocol";
import invokeProxy from "./invoke-protocol"

export default class extends BrowserWindow {
  public readonly remoteApi = invokeProxy.invokeProxyInit(this)

  public constructor(initialUrl?: string) {
    super({
      webPreferences: {
        preload: preloadPath("preload"),
      },
    });
    this.loadURL(initialUrl ?? honoUrl("renderer"));
    dispatchInit.dispatchInit(this);
  }
}
