import { z } from "zod";
import type {
  App,
  BrowserWindow,
  Dialog,
  Event,
  IpcMain,
  IpcMainInvokeEvent,
  WebContents,
} from "electron";
import type { CommunicationBlackBox } from "pure-blackbox/communication";
import Server from "pure-blackbox/server";
import type { ProtocolFrame } from "pure-blackbox/protocol";
import type {
  AnySchema,
  CommunicationTransport,
  RouteDefinition,
  RouteMap,
  ZodCatch,
} from "pure-blackbox/types";
import { electronIpcChannel as channel } from "./protocol.ts";

export type ElectronMainContext = {
  readonly zodCatch: ZodCatch<ElectronMainRuntimeContext>;
  readonly [key: string]: unknown;
};
export type ElectronMainOptions<Context extends ElectronMainContext = ElectronMainContext> = {
  readonly webContents: WebContents;
  readonly context: Context;
  /** Accepted for ergonomic parity with Electron's native API; webContents.ipc is used internally. */
  readonly ipcMain?: IpcMain;
};
export type ElectronMainRuntimeContext = {
  readonly event: IpcMainInvokeEvent;
  readonly webContents: WebContents;
  readonly reload: () => void;
};

const emptyInputSchema = z.object({});
const appPathSchema = z.object({
  name: z.enum([
    "home",
    "appData",
    "assets",
    "userData",
    "sessionData",
    "temp",
    "exe",
    "module",
    "desktop",
    "documents",
    "downloads",
    "music",
    "pictures",
    "videos",
    "recent",
    "logs",
    "crashDumps",
  ]),
});
const dialogMessageSchema = z.object({
  message: z.string(),
  title: z.string().optional(),
  type: z.enum(["none", "info", "error", "question", "warning"]).optional(),
  buttons: z.array(z.string()).max(16).optional(),
  defaultId: z.number().int().nonnegative().optional(),
  cancelId: z.number().int().nonnegative().optional(),
  noLink: z.boolean().optional(),
});

type ElectronMainRoute<
  Context extends ElectronMainContext,
  Schema extends AnySchema,
  Output,
> = RouteDefinition<Schema, Context, ElectronMainRuntimeContext, Output>;

export type ElectronWindowRoutes<Context extends ElectronMainContext> = {
  "/electron/window/show": ElectronMainRoute<Context, typeof emptyInputSchema, void>;
  "/electron/window/hide": ElectronMainRoute<Context, typeof emptyInputSchema, void>;
  "/electron/window/focus": ElectronMainRoute<Context, typeof emptyInputSchema, void>;
  "/electron/window/blur": ElectronMainRoute<Context, typeof emptyInputSchema, void>;
  "/electron/window/reload": ElectronMainRoute<Context, typeof emptyInputSchema, void>;
  "/electron/window/minimize": ElectronMainRoute<Context, typeof emptyInputSchema, void>;
  "/electron/window/maximize": ElectronMainRoute<Context, typeof emptyInputSchema, void>;
  "/electron/window/unmaximize": ElectronMainRoute<Context, typeof emptyInputSchema, void>;
  "/electron/window/restore": ElectronMainRoute<Context, typeof emptyInputSchema, void>;
  "/electron/window/close": ElectronMainRoute<Context, typeof emptyInputSchema, void>;
  "/electron/window/is-visible": ElectronMainRoute<Context, typeof emptyInputSchema, boolean>;
  "/electron/window/is-focused": ElectronMainRoute<Context, typeof emptyInputSchema, boolean>;
  "/electron/window/is-minimized": ElectronMainRoute<Context, typeof emptyInputSchema, boolean>;
  "/electron/window/is-maximized": ElectronMainRoute<Context, typeof emptyInputSchema, boolean>;
  "/electron/window/is-destroyed": ElectronMainRoute<Context, typeof emptyInputSchema, boolean>;
};

export type ElectronAppRoutes<Context extends ElectronMainContext> = {
  "/electron/app/version": ElectronMainRoute<Context, typeof emptyInputSchema, string>;
  "/electron/app/name": ElectronMainRoute<Context, typeof emptyInputSchema, string>;
  "/electron/app/is-packaged": ElectronMainRoute<Context, typeof emptyInputSchema, boolean>;
  "/electron/app/path": ElectronMainRoute<Context, typeof appPathSchema, string>;
};

export type ElectronDialogRoutes<Context extends ElectronMainContext> = {
  "/electron/dialog/message": ElectronMainRoute<
    Context,
    typeof dialogMessageSchema,
    Electron.MessageBoxReturnValue
  >;
};

export type ElectronMainRoutes<Context extends ElectronMainContext = ElectronMainContext> =
  ElectronWindowRoutes<Context>
  & ElectronAppRoutes<Context>
  & ElectronDialogRoutes<Context>;

export type ElectronMainLifecycle = {
  initialized: boolean;
  destroyed: boolean;
  init: () => void;
  destroy: () => void;
};

export class ElectronMainCommunication<
  Context extends ElectronMainContext = ElectronMainContext,
  Routes extends RouteMap = {},
> extends Server<Routes, Context, ElectronMainRuntimeContext> {
  public readonly webContents: WebContents;
  public readonly lifecycle: ElectronMainLifecycle;

  public constructor(options: ElectronMainOptions<Context>);
  public constructor(webContents: WebContents, context: Context);
  public constructor(optionsOrWebContents: ElectronMainOptions<Context> | WebContents, contextArg?: Context) {
    const webContents = "webContents" in optionsOrWebContents
      ? optionsOrWebContents.webContents
      : optionsOrWebContents;
    const context = "webContents" in optionsOrWebContents
      ? optionsOrWebContents.context
      : contextArg;
    if (!context) throw new TypeError("Electron main server context is required");
    const transport: CommunicationTransport = {
      send: (frame) => {
        if (webContents.isDestroyed()) throw new Error("Electron WebContents is destroyed");
        webContents.send(channel, frame);
      },
    };
    super({ transport, context });
    this.webContents = webContents;
    let initialized = false;
    let destroyed = false;
    const invoke = async (event: IpcMainInvokeEvent, raw: unknown): Promise<unknown> => {
      let response: ProtocolFrame | undefined;
      await this.receive(raw, {
        event,
        webContents,
        reload: () => webContents.reload(),
      }, (frame) => {
        response = frame;
      });
      return response;
    };
    const navigation = (_event: Event, _url: string, _inPlace: boolean, _isMainFrame: boolean): void => undefined;
    const closed = (): void => {
      if (initialized) webContents.ipc.removeHandler(channel);
      initialized = false;
      this.closePending(new Error("Electron WebContents disconnected"));
    };
    this.lifecycle = {
      get initialized() { return initialized; },
      set initialized(value: boolean) { initialized = value; },
      destroyed,
      init: () => {
        if (destroyed) throw new Error("Electron communication is destroyed");
        if (initialized) return;
        if (webContents.isDestroyed()) throw new Error("Electron WebContents is destroyed");
        webContents.ipc.handle(channel, invoke);
        webContents.on("did-start-navigation", navigation);
        webContents.on("render-process-gone", closed);
        webContents.on("destroyed", closed);
        initialized = true;
      },
      destroy: () => {
        if (destroyed) return;
        destroyed = true;
        if (initialized) webContents.ipc.removeHandler(channel);
        webContents.off("did-start-navigation", navigation);
        webContents.off("render-process-gone", closed);
        webContents.off("destroyed", closed);
        initialized = false;
        this.closePending(new Error("Electron communication destroyed"));
      },
    };
    Object.defineProperty(this.lifecycle, "destroyed", {
      get: () => destroyed,
      enumerable: true,
    });
    this.lifecycle.init();
  }

  public browserWindow(
    window: BrowserWindow,
  ): this & CommunicationBlackBox<
    Routes & ElectronWindowRoutes<Context>,
    Context,
    ElectronMainRuntimeContext
  > {
    this.on("/electron/window/show", emptyInputSchema, () => { window.show(); });
    this.on("/electron/window/hide", emptyInputSchema, () => { window.hide(); });
    this.on("/electron/window/focus", emptyInputSchema, () => { window.focus(); });
    this.on("/electron/window/blur", emptyInputSchema, () => { window.blur(); });
    this.on("/electron/window/reload", emptyInputSchema, () => { window.reload(); });
    this.on("/electron/window/minimize", emptyInputSchema, () => { window.minimize(); });
    this.on("/electron/window/maximize", emptyInputSchema, () => { window.maximize(); });
    this.on("/electron/window/unmaximize", emptyInputSchema, () => { window.unmaximize(); });
    this.on("/electron/window/restore", emptyInputSchema, () => { window.restore(); });
    this.on("/electron/window/close", emptyInputSchema, () => { window.close(); });
    this.handle("/electron/window/is-visible", emptyInputSchema, () => window.isVisible());
    this.handle("/electron/window/is-focused", emptyInputSchema, () => window.isFocused());
    this.handle("/electron/window/is-minimized", emptyInputSchema, () => window.isMinimized());
    this.handle("/electron/window/is-maximized", emptyInputSchema, () => window.isMaximized());
    this.handle("/electron/window/is-destroyed", emptyInputSchema, () => window.isDestroyed());
    return this as this & CommunicationBlackBox<
      Routes & ElectronWindowRoutes<Context>,
      Context,
      ElectronMainRuntimeContext
    >;
  }

  public app(
    appApi: App,
  ): this & CommunicationBlackBox<
    Routes & ElectronAppRoutes<Context>,
    Context,
    ElectronMainRuntimeContext
  > {
    this.handle("/electron/app/version", emptyInputSchema, () => appApi.getVersion());
    this.handle("/electron/app/name", emptyInputSchema, () => appApi.getName());
    this.handle("/electron/app/is-packaged", emptyInputSchema, () => appApi.isPackaged);
    this.handle("/electron/app/path", appPathSchema, ({ input }) => appApi.getPath(input.name));
    return this as this & CommunicationBlackBox<
      Routes & ElectronAppRoutes<Context>,
      Context,
      ElectronMainRuntimeContext
    >;
  }

  public dialog(
    dialogApi: Dialog,
  ): this & CommunicationBlackBox<
    Routes & ElectronDialogRoutes<Context>,
    Context,
    ElectronMainRuntimeContext
  > {
    this.handle("/electron/dialog/message", dialogMessageSchema, ({ input }) => dialogApi.showMessageBox(input));
    return this as this & CommunicationBlackBox<
      Routes & ElectronDialogRoutes<Context>,
      Context,
      ElectronMainRuntimeContext
    >;
  }
}

export { channel as electronIpcChannel };
