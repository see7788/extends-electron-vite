import { createRoot } from "react-dom/client";
import type { WebviewMessage } from "../node/Interface";
import { vscode } from "./protocol";

const root = document.getElementById("root");
if (!root) throw new Error("VS Code drawer root is missing");

export default function ReactDrawer() {
  //   window.addEventListener("message", event => {
  //   console.log(event.data);
  // });
  return <button onClick={() => vscode.postMessage({ type: "close" } satisfies WebviewMessage)}>关闭抽屉</button>;
}

createRoot(root).render(<ReactDrawer />);
