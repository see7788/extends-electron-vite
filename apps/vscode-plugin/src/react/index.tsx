import {
  useMemo,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import VscodePluginProxy from "vscode-plugin-proxy/web.ts";
import type { implement_t as remote_t } from "../node/index";

const root = document.getElementById("root");
if (!root) throw new Error("VS Code drawer root is missing");

export type implement_t = {
  statusSet(op: string): void;
  colorSet(op: string): void;
};

export default function ReactDrawer() {
  const [status, statusSet] = useState("等待 Extension 消息");
  const [color, colorSet] = useState("#ffffff");
  const runtime = useMemo(() => {
    class ReactRuntime
      extends VscodePluginProxy<remote_t>
      implements implement_t {
      public statusSet:
        implement_t["statusSet"] = statusSet;

      public colorSet:
        implement_t["colorSet"] = colorSet;
    }

    return new ReactRuntime();
  }, []);

  return (
    <main
      style={{
        background: color,
        boxSizing: "border-box",
        minHeight: "100vh",
        padding: 12,
      }}
    >
      <p>{status}</p>
      <button
        onClick={() => {
          void runtime.sendProxy.informationShow(
            "来自 VS Code Webview",
          );
        }}
      >
        显示 VS Code 消息
      </button>
      <button
        onClick={() => {
          void runtime.sendProxy.drawerClose();
        }}
      >
        关闭抽屉
      </button>
    </main>
  );
}

createRoot(root).render(<ReactDrawer />);
