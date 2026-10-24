import { BrowserWindow } from "electron";
import { honoUrl } from "electron-vite-config-lib/mainPlugin/hono";
import preloadPath from "electron-vite-config-lib/preloadCreate/electron";
import dispatchInit from "./invoke-protocol";
import invokeProxy from "../../renderer/index/invoke-protocol"

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
