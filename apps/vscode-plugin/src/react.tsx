import { createRoot } from "react-dom/client";

declare function acquireVsCodeApi(): { postMessage(message: { type: "close" }): void };

const root = document.getElementById("root");
if (!root) throw new Error("VS Code drawer root is missing");
const vscode = acquireVsCodeApi();

export default function ReactDrawer() {
  return <button onClick={() => vscode.postMessage({ type: "close" })}>关闭抽屉</button>;
}

createRoot(root).render(<ReactDrawer />);
