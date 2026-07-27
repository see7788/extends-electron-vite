import { randomBytes } from "node:crypto";
import OneToOne, {
  type methodOp_t,
  type RemoteRuntimeSendEr,
} from "one-to-one";
import * as vscode from "vscode";
import type { ReactRuntime_t } from "../react/index";

const containerId = "see7788-vscode-plugin";
const viewId = "see7788.vscode-plugin.vscodeDrawer";
const openCommandId = "see7788.vscode-plugin.open";

export type ExtensionRuntime_t = {
  drawerClose(op: methodOp_t): void;
  informationShow(op: methodOp_t): void;
};

abstract class VsCodeOneToOne<
  T extends object,
> extends OneToOne<T> {
  public sendEr!: RemoteRuntimeSendEr<T>;
  private receiveClose?: vscode.Disposable;

  constructor(
    private readonly view: vscode.WebviewView,
  ) {
    super();
  }

  public close(): void {
    this.receiveClose?.dispose();
    this.receiveClose = undefined;
  }

  public open() {
    if (this.receiveClose) {
      return this.sendEr;
    }
    this.sendEr = this.init();
    return this.sendEr;
  }

  protected on(
    receive: (
      operation: unknown,
      peerId: string,
    ) => unknown | Promise<unknown>,
  ): void {
    this.receiveClose = this.view.webview.onDidReceiveMessage(
      operation => {
        void receive(operation, this.view.viewType);
      },
    );
  }

  protected send(
    op: unknown,
    peerId?: string,
  ): Promise<void> {
    if (!this.receiveClose) {
      throw new Error("远端通道尚未打开");
    }
    if (
      peerId !== undefined
      && peerId !== this.view.viewType
    ) {
      throw new Error(`发送远端不存在: ${peerId}`);
    }
    return Promise.resolve(
      this.view.webview.postMessage(op),
    ).then(() => undefined);
  }
}

class ExtensionRuntime
  extends VsCodeOneToOne<ReactRuntime_t>
  implements ExtensionRuntime_t {
  public drawerClose(_op: methodOp_t): void {
    void vscode.commands.executeCommand(
      "workbench.action.toggleAuxiliaryBar",
    );
  }

  public informationShow(op: methodOp_t): void {
    void vscode.window.showInformationMessage(op.message);
    this.sendEr.statusSet({
      status: `已收到 ${op.peerId} 的消息`,
    });
    this.sendEr.colorSet({
      color: "#eef6ff",
    });
  }
}

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
      const runtime = new ExtensionRuntime(view);
      try {
        runtime.open();
      } catch (error) {
        void vscode.window.showErrorMessage(String(error));
      }
      view.onDidDispose(
        () => runtime.close(),
        undefined,
        context.subscriptions,
      );
    },
  });
  const openCommand = vscode.commands.registerCommand(openCommandId, async () => {
    await vscode.commands.executeCommand(`workbench.view.extension.${containerId}`);
    await vscode.commands.executeCommand(`${viewId}.focus`);
  });
  context.subscriptions.push(provider, openCommand);
}
