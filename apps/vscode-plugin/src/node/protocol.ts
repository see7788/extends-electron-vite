import type { WebviewMessage } from "./Interface";

export function webviewMessageParse(message: unknown): WebviewMessage | undefined {
  if (!webviewMessageIsClose(message)) return;

  return message;
}

function webviewMessageIsClose(message: unknown): message is WebviewMessage {
  return typeof message === "object" && message !== null && "type" in message && message.type === "close";
}
