import { randomBytes } from "node:crypto";
import * as vscode from "vscode";
import { webviewMessageParse } from "./protocol";

const containerId = "see7788-vscode-plugin";
const viewId = "see7788.vscode-plugin.vscodeDrawer";
const openCommandId = "see7788.vscode-plugin.open";

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
      view.webview.onDidReceiveMessage(message => {
        if (webviewMessageParse(message)?.type === "close") void vscode.commands.executeCommand("workbench.action.toggleAuxiliaryBar");
      });
      // view.webview.postMessage({ type: "status", running: true });
    },
  });
  const openCommand = vscode.commands.registerCommand(openCommandId, async () => {
    await vscode.commands.executeCommand(`workbench.view.extension.${containerId}`);
    await vscode.commands.executeCommand(`${viewId}.focus`);
  });
  context.subscriptions.push(provider, openCommand);
}
