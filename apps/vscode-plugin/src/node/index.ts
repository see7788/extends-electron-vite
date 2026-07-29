import { randomBytes } from "node:crypto";
import VscodePluginProxy from "vscode-plugin-proxy/node.ts";
import * as vscode from "vscode";
import type { implement_t as remote_t } from "../react/index";

const containerId = "see7788-vscode-plugin";
const viewId = "see7788.vscode-plugin.vscodeDrawer";
const openCommandId = "see7788.vscode-plugin.open";

export type implement_t = {
  drawerClose():void
  informationShow(op: string): void
};

export function activate(context: vscode.ExtensionContext) {
  const provider = vscode.window.registerWebviewViewProvider(viewId, {
    resolveWebviewView(view) {
      const nonce = randomBytes(16).toString("base64");
      const origin = "http://127.0.0.1:5173";
      const development = import.meta.env.MODE === "development";
      const root = vscode.Uri.joinPath(context.extensionUri, "dist");
      view.webview.options = { enableScripts: true, localResourceRoots: development ? [] : [root] };
      const react = development ? `${origin}/src/react/index.tsx` : view.webview.asWebviewUri(vscode.Uri.joinPath(root, "react.js"));
      const client = development ? `<script nonce="${nonce}" type="module" src="${origin}/@vite/client"></script>` : "";
      const csp = development
        ? `default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}' ${origin}; connect-src ${origin} ws://127.0.0.1:5173;`
        : `default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';`;
      view.webview.html = `<!DOCTYPE html><meta charset="UTF-8"><meta http-equiv="Content-Security-Policy" content="${csp}"><style nonce="${nonce}">html,body,#root{margin:0;min-height:100%;height:100%;background:#fff}</style><div id="root"></div>${client}<script nonce="${nonce}" type="module" src="${react}"></script>`;

      class ExtensionRuntime
        extends VscodePluginProxy<remote_t>
        implements implement_t {
        public drawerClose: implement_t["drawerClose"] = async () => {
          await vscode.commands.executeCommand(
            "workbench.action.toggleAuxiliaryBar",
          );
        };

        public informationShow: implement_t["informationShow"] = async op => {
          await vscode.window.showInformationMessage(op);
          await this.sendProxy.statusSet("已收到 Webview 消息");
          await this.sendProxy.colorSet("#eef6ff");
        };
      }

      new ExtensionRuntime(view);
    },
  });
  const openCommand = vscode.commands.registerCommand(openCommandId, async () => {
    await vscode.commands.executeCommand(`workbench.view.extension.${containerId}`);
    await vscode.commands.executeCommand(`${viewId}.focus`);
  });
  context.subscriptions.push(provider, openCommand);
}
