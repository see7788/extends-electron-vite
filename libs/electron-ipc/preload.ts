import { contextBridge, ipcRenderer } from "electron";
import Client from "pure-blackbox/client";
import type { ProtocolFrame } from "pure-blackbox/protocol";
import type { RouteMap } from "pure-blackbox/types";
import { electronBridgeKey, electronIpcChannel as channel } from "./protocol.ts";

export type ElectronPreloadContext = { readonly zodCatch?: never; readonly [key: string]: unknown };
export type ElectronPreloadRuntimeContext = { readonly event: Electron.IpcRendererEvent };

export type ElectronPreloadBridge = {
  invoke: (frame: ProtocolFrame) => Promise<unknown>;
  subscribe: (listener: (frame: unknown, event: Electron.IpcRendererEvent) => void) => () => void;
};

export type ElectronPreloadClientOptions<Context extends ElectronPreloadContext = ElectronPreloadContext> = {
  readonly context: Context;
  readonly expose?: boolean;
};

export class ElectronPreloadClient<
  Context extends ElectronPreloadContext = ElectronPreloadContext,
  Routes extends RouteMap = {},
> extends Client<Routes, Context, ElectronPreloadRuntimeContext> {
  public readonly bridge: ElectronPreloadBridge;
  public readonly lifecycle: {
    initialized: boolean;
    destroyed: boolean;
    init: () => void;
    destroy: () => void;
  };

  public constructor(
    contextOrOptions: Context | ElectronPreloadClientOptions<Context> = {} as Context,
    lifecycleOptions: { readonly expose?: boolean } = {},
  ) {
    const isOptions = Object.prototype.hasOwnProperty.call(contextOrOptions, "context");
    const context = (isOptions
      ? (contextOrOptions as ElectronPreloadClientOptions<Context>).context
      : contextOrOptions) as Context;
    const expose = isOptions
      ? (contextOrOptions as ElectronPreloadClientOptions<Context>).expose
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

export const installElectronPreload = <Context extends ElectronPreloadContext = ElectronPreloadContext, Routes extends RouteMap = {}>(
  client?: ElectronPreloadClient<Context, Routes>,
): ElectronPreloadBridge => (client ?? new ElectronPreloadClient<Context, Routes>()).bridge;

export { electronBridgeKey, electronIpcChannel } from "./protocol.ts";
export type { ElectronPreloadBridge as Bridge };
