import { contextBridge, ipcRenderer, type BrowserWindow, type IpcMainEvent, type IpcMainInvokeEvent, type IpcRendererEvent } from "electron";
import Base, { type context_t as context_2, type invokeProxy_t } from "invoke-protocol";

const key = "@runtimeproxy/electron-invoke-protocol";

declare global {
  interface Window {
    readonly "@runtimeproxy/electron-invoke-protocol": typeof ipcRenderer;
  }
}

export interface context_main extends context_2 {
  readonly browser: BrowserWindow
  readonly event: IpcMainInvokeEvent
}

export function main() {
  class Main extends Base<context_main & { readonly browser: BrowserWindow }> {
    public override async dispatchInit<Self extends this>(
      this: Self,
      { browser }: Pick<context_main, "browser">
    ): Promise<void> {
      //main进程作为生产者
      if (browser.webContents.isDestroyed()) {
        throw new Error("Electron WebContents is destroyed");
      }
      browser.webContents.ipc.handle(
        key,
        (event, operation: Pick<context_main, "path" | "input">) =>
          this.dispatchRoute({ ...operation, browser, event }),
      );
    }

    public get invokeProxy(): invokeProxy_t<this["routers"]> {
      //render进程作为消费者
      return this.invokeProxyInit(input => window[key].invoke(key, input));
    }
  }

  return new Main();
}

export interface context_render extends context_2 {
  readonly event: IpcRendererEvent
}

export function render() {
  class Render extends Base<context_render> {
    public override async dispatchInit<Self extends this>(
      this: Self,
    ): Promise<invokeProxy_t<Self["routers"]>> {
      //render进程作为生产者
      let event: IpcRendererEvent
      const { invokeProxy, close } = this.invokeProxyFromSendOn(
        message => window[key].send(key, message),
        listener =>
          window[key].on(key, (_event, message) => {
            event = _event
            listener(message)
          }),
        operation => this.dispatchRoute({ ...operation, event }),
      );
      window.addEventListener("unload", close, { once: true });
      return invokeProxy;
    }

    public invokeProxy(
      browser: BrowserWindow,
    ): invokeProxy_t<this["routers"]> {
      //main进程作为消费者
      if (browser.webContents.isDestroyed()) {
        throw new Error("Electron WebContents is destroyed");
      }
      const { invokeProxy, close } = this.invokeProxyFromSendOn(
        message => browser.webContents.send(key, message),
        listener => {
          const onMessage = (_event: IpcMainEvent, message: unknown): void =>
            listener(message);
          browser.webContents.ipc.on(key, onMessage);
          browser.webContents.once("destroyed", () =>
            browser.webContents.ipc.off(key, onMessage),
          );
          browser.webContents.once("render-process-gone", () =>
            browser.webContents.ipc.off(key, onMessage),
          );
        },
        operation => this.dispatchRoute(operation),
      );
      browser.webContents.once("destroyed", close);
      browser.webContents.once("render-process-gone", close);
      return invokeProxy;
    }
  }

  return new Render();
}

export function preload(): void {
  contextBridge.exposeInMainWorld(key, ipcRenderer);
}
