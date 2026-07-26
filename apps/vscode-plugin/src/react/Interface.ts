import type { WebviewMessage } from "../node/Interface";

export interface VsCodeApi {
  postMessage(message: WebviewMessage): void;
}
