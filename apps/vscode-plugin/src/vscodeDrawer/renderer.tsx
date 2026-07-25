import { createRoot } from "react-dom/client";
import App from "./App";
import type { VscodeDrawerIncoming, VscodeDrawerOutgoing } from "./protocol";
declare function acquireVsCodeApi(): { postMessage(message: VscodeDrawerIncoming): void };

const vscode = acquireVsCodeApi();
const messageSend = (message: VscodeDrawerIncoming) => vscode.postMessage(message);
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("VS Code drawer root is missing");

const reactRoot = createRoot(rootElement);
const drawerRender = (message?: VscodeDrawerOutgoing) => reactRoot.render(<App message={message} messageSend={messageSend} />);

window.addEventListener("message", event => {
  const message = event.data as VscodeDrawerOutgoing;
  if (message?.type !== "status") return;
  drawerRender(message);
});
drawerRender();
