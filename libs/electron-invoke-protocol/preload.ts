import { contextBridge, ipcRenderer } from "electron";
import Base, {
  type invokeProxy_t,
  type rpc_t,
} from "invoke-protocol";
import { electronBridgeKey, electronIpcChannel as channel } from "./protocol.ts";

export type ElectronPreloadBridge = {
  readonly send: (message: unknown) => void;
  readonly on: (listener: (message: unknown) => void) => () => void;
};

export type ElectronPreloadRuntimeContext<routers extends object = {}> = {
  readonly event: Electron.IpcRendererEvent;
  readonly window: Window;
  readonly document: Document;
  readonly invokeProxy: invokeProxy_t<routers>;
};

export default abstract class ElectronPreload<
  env extends object = {},
  routers extends object = {},
> extends Base<
  routers,
  rpc_t & env & ElectronPreloadRuntimeContext<routers>
> {
  public invokeProxy!: invokeProxy_t<routers>;

  public override async dispatchInit({
    env = () => ({} as env),
    expose = true,
  }: {
    readonly env?: () => env;
    readonly expose?: boolean;
  } = {}): Promise<void> {
    if (this.invokeProxy) return;

    let receive: ((message: unknown) => void) | undefined;
    let event: Electron.IpcRendererEvent | undefined;
    const onMessage = (senderEvent: Electron.IpcRendererEvent, message: unknown): void => {
      event = senderEvent;
      receive?.(message);
      event = undefined;
    };

    const bridge: ElectronPreloadBridge = {
      send: message => {
        ipcRenderer.send(channel, message);
      },
      on: listener => {
        const callback = (_event: Electron.IpcRendererEvent, message: unknown): void => listener(message);
        ipcRenderer.on(channel, callback);
        return () => ipcRenderer.off(channel, callback);
      },
    };

    this.invokeProxy = this.invokeProxyFromSendOn(
      bridge.send,
      listener => {
        receive = listener;
        ipcRenderer.on(channel, onMessage);
      },
      listener => {
        const close = (): void => {
          ipcRenderer.off(channel, onMessage);
          receive = undefined;
          listener();
        };
        window.addEventListener("unload", close, { once: true });
      },
      ({ invokeProxy, path, input }) => ({
        ...env(),
        event: event as Electron.IpcRendererEvent,
        window,
        document,
        invokeProxy,
        path,
        input,
      }),
    );

    if (expose) contextBridge.exposeInMainWorld(electronBridgeKey, bridge);
  }
}

export { electronBridgeKey, electronIpcChannel } from "./protocol.ts";
