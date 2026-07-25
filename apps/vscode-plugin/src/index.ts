import { randomBytes } from "node:crypto";
import { createServer, type Server } from "node:http";
import * as vscode from "vscode";
import type { VscodeDrawerIncoming, VscodeDrawerOutgoing } from "./vscodeDrawer/protocol";

const honoHost = import.meta.env.VITE_HONO_HOST;
const honoPort = Number(import.meta.env.VITE_HONO_PORT);

class NativeHttpController {
  private server: Server | undefined;
  private status: VscodeDrawerOutgoing = { type: "status", endpoint: this.endpoint, state: "stopped" };

  constructor(private readonly statusPost: (status: VscodeDrawerOutgoing) => void) {}

  get statusGet() {
    return this.status;
  }

  async toggle() {
    if (this.server) return this.stop();
    return this.start();
  }

  async start() {
    if (this.server) return;
    this.statusSet({ type: "status", endpoint: this.endpoint, state: "operating" });
    const server = createServer((_request, response) => response.end());
    try {
      await new Promise<void>((resolve, reject) => {
        const listenError = (error: Error) => reject(error);
        server.once("error", listenError);
        server.listen(honoPort, honoHost, () => {
          server.off("error", listenError);
          resolve();
        });
      });
      this.server = server;
      this.statusSet({ type: "status", endpoint: this.endpoint, state: "running" });
    } catch (error) {
      server.close();
      this.statusSet({ type: "status", endpoint: this.endpoint, state: "error", error: error instanceof Error ? error.message : String(error) });
    }
  }

  async stop() {
    const server = this.server;
    if (!server) return;
    this.statusSet({ type: "status", endpoint: this.endpoint, state: "operating" });
    try {
      await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
      this.server = undefined;
      this.statusSet({ type: "status", endpoint: this.endpoint, state: "stopped" });
    } catch (error) {
      this.statusSet({ type: "status", endpoint: this.endpoint, state: "error", error: error instanceof Error ? error.message : String(error) });
    }
  }

  private get endpoint() {
    return `http://${honoHost}:${honoPort}`;
  }

  private statusSet(status: VscodeDrawerOutgoing) {
    this.status = status;
    this.statusPost(status);
  }
}

let nativeHttpController: NativeHttpController | undefined;

export async function activate(context: vscode.ExtensionContext) {
  let webview: vscode.Webview | undefined;
  nativeHttpController = new NativeHttpController(status => void webview?.postMessage(status));
  const provider = vscode.window.registerWebviewViewProvider("extendsCodex.vscodeDrawer", {
    resolveWebviewView(view) {
      webview = view.webview;
      const production = import.meta.env.MODE === "extension-production";
      const root = vscode.Uri.joinPath(context.extensionUri, "dist", "vscodeDrawer");
      view.webview.options = { enableScripts: true, localResourceRoots: production ? [root] : [] };
      const nonce = randomBytes(16).toString("base64");
      const origin = "http://127.0.0.1:5173";
      const script = production
        ? view.webview.asWebviewUri(vscode.Uri.joinPath(root, "index.js"))
        : `${origin}/src/vscodeDrawer/renderer.tsx`;
      const client = production ? "" : `<script nonce="${nonce}" type="module" src="${origin}/@vite/client"></script>`;
      const csp = production
        ? `default-src 'none'; script-src 'nonce-${nonce}';`
        : `default-src 'none'; script-src 'nonce-${nonce}' ${origin}; connect-src ${origin} ws://127.0.0.1:5173;`;
      view.webview.html = `<!DOCTYPE html><meta charset="UTF-8"><meta http-equiv="Content-Security-Policy" content="${csp}"><div id="root"></div>${client}<script nonce="${nonce}" type="module" src="${script}"></script>`;
      view.webview.onDidReceiveMessage((message: VscodeDrawerIncoming) => {
        if (message.type === "ready") return void webview?.postMessage(nativeHttpController?.statusGet);
        if (message.type === "toggle") void nativeHttpController?.toggle();
      });
    },
  });
  context.subscriptions.push(provider);
  await nativeHttpController.start();
}

export function deactivate() {
  return nativeHttpController?.stop();
}
