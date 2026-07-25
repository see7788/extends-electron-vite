import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import type { VscodeDrawerIncoming, VscodeDrawerOutgoing } from "./node";

function App({
  message,
  messageSend,
}: {
  message?: VscodeDrawerOutgoing;
  messageSend: (message: VscodeDrawerIncoming) => void;
}) {
  useEffect(() => {
    messageSend({ type: "ready" });
  }, [messageSend]);
  const status: VscodeDrawerOutgoing = message ?? { type: "status", endpoint: "", state: "operating" };
  return <main>
    <button disabled={status.state === "operating"} onClick={() => messageSend({ type: "toggle" })}>{status.endpoint}</button>
    <p>{status.error ?? status.state}</p>
  </main>;
}

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
