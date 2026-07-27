import { BrowserWindow } from "electron";
import rendererHonoUrl from "electron.vite.config/rendererHonoReactPlugin/url";

export default class MainBrowser {
  private window: BrowserWindow | undefined;

  open() {
    if (this.window && !this.window.isDestroyed()) {
      this.window.focus();
      return;
    }

    const window = new BrowserWindow({
      width: 1240,
      height: 820,
      title: "ZNTD Admin 2",
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
      },
    });

    this.window = window;
    window.on("closed", () => {
      if (this.window === window) this.window = undefined;
    });
    void window.loadURL(rendererHonoUrl("admin-web"));
  }
}
