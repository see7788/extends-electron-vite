import Base, {
  type invokeProxy_t,
  type rpc_t,
} from "invoke-protocol";
import { electronBridgeKey } from "./protocol.ts";
import type { ElectronPreloadBridge } from "./preload.ts";

export type ElectronRendererRuntimeContext<routers extends object = {}> = {
  readonly window: Window;
  readonly document: Document;
  readonly invokeProxy: invokeProxy_t<routers>;
};

const bridgeRead = (): ElectronPreloadBridge => {
  const bridge = Reflect.get(globalThis, electronBridgeKey) as Partial<ElectronPreloadBridge> | undefined;
  if (!bridge || typeof bridge.send !== "function" || typeof bridge.on !== "function") {
    throw new Error("Electron preload bridge is missing");
  }
  return bridge as ElectronPreloadBridge;
};

export default abstract class ElectronRenderer<
  env extends object = {},
  routers extends object = {},
> extends Base<
  routers,
  rpc_t & env & ElectronRendererRuntimeContext<routers>
> {
  public invokeProxy!: invokeProxy_t<routers>;

  public override async dispatchInit({
    env = () => ({} as env),
  }: {
    readonly env?: () => env;
  } = {}): Promise<void> {
    if (this.invokeProxy) return;

    const electron = bridgeRead();
    this.invokeProxy = this.invokeProxyFromSendOn(
      electron.send,
      listener => {
        electron.on(listener);
      },
      listener => {
        window.addEventListener("unload", listener, { once: true });
      },
      ({ invokeProxy, path, input }) => ({
        ...env(),
        window,
        document,
        invokeProxy,
        path,
        input,
      }),
    );
  }
}
