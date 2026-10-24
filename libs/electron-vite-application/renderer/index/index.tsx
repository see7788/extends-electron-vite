import dispatchInit from "./invoke-protocol";
import invokeProxy from "../../main/Browser/invoke-protocol"
class App {
  public readonly remoteApi = invokeProxy.invokeProxyInit();

  public constructor() {
    void dispatchInit.dispatchInit();
  }
}

new App();
