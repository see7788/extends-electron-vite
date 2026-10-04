import { contextBridge, ipcRenderer } from "electron";
import Base from "invoke-protocol";
import type { z } from "zod";
type ProtocolFrame = { readonly type: "request"; readonly id: string; readonly route: string; readonly input: unknown } | { readonly type: "response"; readonly id: string; readonly ok: boolean; readonly output?: unknown; readonly error?: unknown };
type RouteMap = Record<string, { readonly schema: z.ZodType; readonly handler: (...args: any[]) => any }>;
export const hc = <Routes extends RouteMap>(communication: { readonly invoke: (path: string, input: unknown) => Promise<unknown> }): any => { const create = (path: string): any => new Proxy(() => undefined, { get: (_target, property: string | symbol) => typeof property === "string" ? create(path ? `${path}/${property}` : property) : undefined, apply: (_target, _thisArg, args: unknown[]) => communication.invoke(path, args[0]) }); return create(""); };
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
> extends Base<Context & ElectronPreloadRuntimeContext, {}> {
  public receive(_frame: unknown, _context?: unknown): void { }
  public closePending(_reason: unknown): void { }

  public readonly bridge: ElectronPreloadBridge;
  public readonly invoke: (path: string, input: unknown) => Promise<unknown>;
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
    super();
    this.invoke = (path, input) => bridge.invoke({ type: "request", id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`, route: path, input }) as Promise<unknown>;
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
