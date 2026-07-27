import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import OneToOne, {
  type methodOp_t,
  type RemoteRuntimeSendEr,
} from "one-to-one";
import type { ExtensionRuntime_t } from "../node/index";

const root = document.getElementById("root");
if (!root) throw new Error("VS Code drawer root is missing");

type VsCodeApi = {
  postMessage(message: unknown): void;
};

declare function acquireVsCodeApi(): VsCodeApi;

const vscode = acquireVsCodeApi();

export type ReactRuntime_t = {
  statusSet(op: methodOp_t): void;
  colorSet(op: methodOp_t): void;
};

abstract class WebviewOneToOne<
  T extends object,
> extends OneToOne<T> {
  public sendEr!: RemoteRuntimeSendEr<T>;
  private readonly peerId = "extension";
  private receiveClose?: () => void;

  public close(): void {
    this.receiveClose?.();
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
    const messageReceive = (event: MessageEvent) => {
      void receive(event.data, this.peerId);
    };
    window.addEventListener("message", messageReceive);
    this.receiveClose = () => {
      window.removeEventListener("message", messageReceive);
    };
  }

  protected send(
    op: unknown,
    peerId?: string,
  ): void {
    if (!this.receiveClose) {
      throw new Error("远端通道尚未打开");
    }
    if (
      peerId !== undefined
      && peerId !== this.peerId
    ) {
      throw new Error(`发送远端不存在: ${peerId}`);
    }
    vscode.postMessage(op);
  }
}

class ReactRuntime
  extends WebviewOneToOne<ExtensionRuntime_t>
  implements ReactRuntime_t {
  constructor(
    private readonly statusApply: (status: string) => void,
    private readonly colorApply: (color: string) => void,
  ) {
    super();
  }

  public statusSet(op: methodOp_t): void {
    this.statusApply(op.status);
  }

  public colorSet(op: methodOp_t): void {
    this.colorApply(op.color);
  }
}

export default function ReactDrawer() {
  const [status, statusSet] = useState("等待 Extension 消息");
  const [color, colorSet] = useState("#ffffff");
  const [isOpen, isOpenSet] = useState(false);
  const runtime = useMemo(() => new ReactRuntime(
    statusSet,
    colorSet,
  ), []);

  useEffect(() => {
    try {
      runtime.open();
      isOpenSet(true);
    } catch (error) {
      statusSet(String(error));
    }
    return () => {
      runtime.close();
    };
  }, [runtime]);

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
        disabled={!isOpen}
        onClick={() => {
          runtime.sendEr.informationShow({
            message: "来自 VS Code Webview",
          });
        }}
      >
        显示 VS Code 消息
      </button>
      <button
        disabled={!isOpen}
        onClick={() => {
          runtime.sendEr.drawerClose({});
        }}
      >
        关闭抽屉
      </button>
    </main>
  );
}

createRoot(root).render(<ReactDrawer />);
