import { contextBridge, ipcRenderer } from "electron";
import { CommunicationClient } from "pure-blackbox/client";
import type { CommunicationClientOptions } from "pure-blackbox/client";
import type { ProtocolFrame, RouteMap } from "pure-blackbox/types";
import { electronBridgeKey, electronIpcChannel as channel } from "./protocol.ts";

export type ElectronPreloadContext = { readonly zodCatch?: never; readonly [key: string]: unknown };
export type ElectronPreloadRuntimeContext = { readonly event: Electron.IpcRendererEvent };

export type ElectronPreloadBridge = {
  invoke: (frame: ProtocolFrame) => Promise<unknown>;
  subscribe: (listener: (frame: unknown, event: Electron.IpcRendererEvent) => void) => () => void;
};

export type ElectronPreloadClientOptions<TContext extends ElectronPreloadContext = ElectronPreloadContext> =
  Omit<CommunicationClientOptions<TContext, ElectronPreloadRuntimeContext>, "transport"> & {
    readonly expose?: boolean;
  };

export class ElectronPreloadClient<
  TContext extends ElectronPreloadContext = ElectronPreloadContext,
  TRoutes extends RouteMap = {},
> extends CommunicationClient<TRoutes, TContext, ElectronPreloadRuntimeContext> {
  public readonly bridge: ElectronPreloadBridge;
  public readonly lifecycle: {
    initialized: boolean;
    destroyed: boolean;
    init: () => void;
    destroy: () => void;
  };

  public constructor(
    contextOrOptions: TContext | ElectronPreloadClientOptions<TContext> = {} as TContext,
    lifecycleOptions: { readonly expose?: boolean } = {},
  ) {
    const isOptions = Object.prototype.hasOwnProperty.call(contextOrOptions, "context");
    const context = (isOptions
      ? (contextOrOptions as ElectronPreloadClientOptions<TContext>).context
      : contextOrOptions) as TContext;
    const expose = isOptions
      ? (contextOrOptions as ElectronPreloadClientOptions<TContext>).expose
      : lifecycleOptions.expose;
    const bridge: ElectronPreloadBridge = {
      invoke: (frame) => ipcRenderer.invoke(channel, frame),
      subscribe: (listener) => {
        const callback = (event: Electron.IpcRendererEvent, value: unknown): void => listener(value, event);
        ipcRenderer.on(channel, callback);
        return () => ipcRenderer.off(channel, callback);
      },
    };
    super({ context, transport: { send: (frame) => bridge.invoke(frame) } });
    this.bridge = bridge;
    if (expose !== false) contextBridge.exposeInMainWorld(electronBridgeKey, bridge);
    const unsubscribe = bridge.subscribe((frame, event) => {
      void this.receive(frame, { event });
    });
    let destroyed = false;
    this.lifecycle = {
      get initialized() { return !destroyed; },
      get destroyed() { return destroyed; },
      init: () => { if (destroyed) throw new Error("Electron preload client is destroyed"); },
      destroy: () => {
        if (destroyed) return;
        destroyed = true;
        unsubscribe();
        this.closePending(new Error("Electron preload client destroyed"));
      },
    };
  }
}

export const installElectronPreload = <TContext extends ElectronPreloadContext = ElectronPreloadContext, TRoutes extends RouteMap = {}>(
  client?: ElectronPreloadClient<TContext, TRoutes>,
): ElectronPreloadBridge => (client ?? new ElectronPreloadClient<TContext, TRoutes>()).bridge;

export { electronBridgeKey, electronIpcChannel } from "./protocol.ts";
export type { ElectronPreloadBridge as Bridge };
