import { randomBytes } from "node:crypto";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const provider = vscode.window.registerWebviewViewProvider("extendsCodex.vscodeDrawer", {
    resolveWebviewView(view) {
      const nonce = randomBytes(16).toString("base64");
      const origin = "http://127.0.0.1:5173";
      view.webview.options = { enableScripts: true };
      view.webview.html = `<!DOCTYPE html><meta charset="UTF-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}' ${origin}; connect-src ${origin} ws://127.0.0.1:5173;"><div id="root"></div><script nonce="${nonce}" type="module" src="${origin}/@vite/client"></script><script nonce="${nonce}" type="module" src="${origin}/src/react.tsx"></script>`;
      view.webview.onDidReceiveMessage((message: { type?: unknown }) => {
        if (message.type === "close") void vscode.commands.executeCommand("workbench.action.closeSidebar");
      });
    },
  });
  context.subscriptions.push(provider);
}
