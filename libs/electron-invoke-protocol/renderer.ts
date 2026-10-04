import Base from "invoke-protocol";
import type { z } from "zod";
type RouteMap = Record<string, { readonly schema: z.ZodType; readonly handler: (...args: any[]) => any }>;
export const hc = <Routes extends RouteMap>(communication: { readonly invoke: (path: string, input: unknown) => Promise<unknown> }): any => { const create = (path: string): any => new Proxy(() => undefined, { get: (_target, property: string | symbol) => typeof property === "string" ? create(path ? `${path}/${property}` : property) : undefined, apply: (_target, _thisArg, args: unknown[]) => communication.invoke(path, args[0]) }); return create(""); };
import { electronBridgeKey } from "./protocol.ts";
import type { ElectronPreloadBridge } from "./preload.ts";

export type ElectronRendererContext = { readonly zodCatch?: never; readonly [key: string]: unknown };
export type ElectronRendererRuntimeContext = {
  readonly window: typeof globalThis;
};

export type ElectronRendererLifecycle = {
  initialized: boolean;
  destroyed: boolean;
  init: () => void;
  destroy: () => void;
};

const bridgeRead = (): ElectronPreloadBridge => {
  const bridge = Reflect.get(globalThis, electronBridgeKey) as unknown;
  if (typeof bridge !== "object" || bridge === null) throw new Error("Electron preload bridge is missing");
  const invoke = Reflect.get(bridge, "invoke");
  const subscribe = Reflect.get(bridge, "subscribe");
  if (typeof invoke !== "function" || typeof subscribe !== "function") throw new TypeError("Electron preload bridge is invalid");
  return bridge as ElectronPreloadBridge;
};

export class ElectronRendererCommunication<
  Context extends ElectronRendererContext = ElectronRendererContext,
  Routes extends RouteMap = {},
> extends Base<Context & ElectronRendererRuntimeContext, {}> {
  public receive(_frame: unknown, _context?: unknown): void { }
  public closePending(_reason: unknown): void { }

  public readonly invoke: (path: string, input: unknown) => Promise<unknown>;
  public readonly lifecycle: ElectronRendererLifecycle;

  public constructor(context: Context) {
    const bridge = bridgeRead();
    super();
    this.invoke = (path, input) => bridge.invoke({ type: "request", id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`, route: path, input }) as Promise<unknown>;
    let initialized = false;
    let destroyed = false;
    let unsubscribe: (() => void) | undefined;
    this.lifecycle = {
      get initialized() { return initialized; },
      set initialized(value: boolean) { initialized = value; },
      get destroyed() { return destroyed; },
      init: () => {
        if (destroyed) throw new Error("Electron renderer communication is destroyed");
        if (initialized) return;
        unsubscribe = bridge.subscribe((frame: unknown) => { void this.receive(frame, { window: globalThis }); });
        initialized = true;
      },
      destroy: () => {
        if (destroyed) return;
        destroyed = true;
        unsubscribe?.();
        unsubscribe = undefined;
        initialized = false;
        this.closePending(new Error("Electron renderer communication destroyed"));
      },
    };
    this.lifecycle.init();
  }
}
