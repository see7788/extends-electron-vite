import { contextBridge, ipcRenderer, type BrowserWindow, type IpcMainEvent } from "electron";
import Base, { type context_t as context_2 } from "invoke-protocol";
import Remote, { type invokeProxy_t } from "invoke-protocol/remote";

const key = "@runtimeproxy/electron-invoke-protocol";
declare global {
  interface Window {
    readonly "@runtimeproxy/electron-invoke-protocol": typeof ipcRenderer;
  }
}

export function main() {
  class Main extends Base<context_2 & { readonly browser: BrowserWindow }> {
    public override async dispatchInit<Self extends this>(
      this: Self,
      { browser }: { readonly browser: BrowserWindow },
    ): Promise<void> {
      //主进程注册的方法进行挂载
      if (browser.webContents.isDestroyed()) {
        throw new Error("Electron WebContents is destroyed");
      }
      browser.webContents.ipc.handle(key, (_event, operation: Pick<context_2, "path" | "input">) =>
        this.dispatchRoute({ ...operation, browser }),
      );
    }

    public get invokeProxy(): invokeProxy_t<this["routes"]> {
      //render进程消费
      return new Remote<this>().invokeProxyInit(input => window[key].invoke(key, input));
    }
  }
  return new Main();
}

export function render() {
  class Render extends Base<context_2> {
    public override async dispatchInit<Self extends this>(this: Self): Promise<invokeProxy_t<Self["routes"]>> {
      //render进程注册的方法进行挂载
      return new Remote<Self>().invokeProxyFromSendOn(
        message => window[key].send(key, message),
        listener => window[key].on(key, (_event, message) => listener(message)),
        close => window.addEventListener("unload", close, { once: true }),
        operation => this.dispatchRoute(operation),
      );
    }

    public invokeProxy(browser: BrowserWindow): invokeProxy_t<this["routes"]> {
      //主进程消费
      if (browser.webContents.isDestroyed()) {
        throw new Error("Electron WebContents is destroyed");
      }
      let receive: ((message: unknown) => void) | undefined;
      const onMessage = (_event: IpcMainEvent, message: unknown): void => receive?.(message);
      return new Remote<this>().invokeProxyFromSendOn(
        message => browser.webContents.send(key, message),
        listener => {
          receive = listener;
          browser.webContents.ipc.on(key, onMessage);
        },
        listener => {
          const close = (): void => {
            browser.webContents.ipc.off(key, onMessage);
            receive = undefined;
            listener();
          };
          browser.webContents.once("destroyed", close);
          browser.webContents.once("render-process-gone", close);
        },
        operation => this.dispatchRoute(operation),
      );
    }
  }
  return new Render();
}

export function preload(): void {
  contextBridge.exposeInMainWorld(key, ipcRenderer);
}