import { CommunicationClient } from "pure-blackbox/client";
import type { RouteMap } from "pure-blackbox/types";
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
  TContext extends ElectronRendererContext = ElectronRendererContext,
  TRoutes extends RouteMap = {},
> extends CommunicationClient<TRoutes, TContext, ElectronRendererRuntimeContext> {
  public readonly lifecycle: ElectronRendererLifecycle;

  public constructor(context: TContext) {
    const bridge = bridgeRead();
    super({ transport: { send: (frame) => bridge.invoke(frame) }, context });
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
