import Base, { type context_t as context_2 } from "invoke-protocol";
import { invokeprotocolKey } from "./index/declare";

export interface context_t extends context_2 {}

export default class Producer extends Base<context_t> {
  public override async dispatchInit(): Promise<void> {
    const ipc = window[invokeprotocolKey];
    const { close } = this.dispatchFromSendOn({
      sendUnknown: message => ipc.send(invokeprotocolKey, message),
      onUnknown: listener => {
        const onMessage = (message: unknown): void => listener(message);
        ipc.on(invokeprotocolKey, onMessage);
        return () => ipc.off(invokeprotocolKey, onMessage);
      },
      routeParam: operation => operation,
    });
    window.addEventListener("unload", close, { once: true });
  }

  public invokeProxyInit() {
    const ipc = window[invokeprotocolKey];
    return this.invokeProxyInitFromInvoke(arg => ipc.invoke(invokeprotocolKey, arg));
  }
}
