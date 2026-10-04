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
import Base from "invoke-protocol";
type AnySchema = z.ZodType;
type ProtocolFrame = { readonly type: "request"; readonly id: string; readonly route: string; readonly input: unknown } | { readonly type: "response"; readonly id: string; readonly ok: boolean; readonly output?: unknown; readonly error?: unknown };
type RouteDefinition<Schema extends AnySchema, Context extends object, RuntimeContext extends object, Output> = { readonly schema: Schema; readonly handler: (context: Context & RuntimeContext & { readonly input: z.output<Schema> }) => Output | Promise<Output> };
type RouteMap = Record<string, RouteDefinition<any, any, any, any>>;
type ZodCatch<RuntimeContext extends object> = (info: { readonly error: z.ZodError; readonly rawInput: unknown; readonly route: string; readonly runtimeContext: RuntimeContext }) => unknown | Promise<unknown>;
type CommunicationBlackBox<Routes extends RouteMap = {}, Context extends object = {}, RuntimeContext extends object = {}> = object;
type CommunicationTransport = { readonly send: (frame: ProtocolFrame) => unknown | Promise<unknown> };
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
> extends Base<Context & ElectronMainRuntimeContext, {}> {
  private readonly pending = new Map<string, { readonly resolve: (value: any) => void; readonly reject: (reason: unknown) => void }>();
  private sequence = 0;
  private routePath(path: string): string { return path.replace(/^\/+/, "").replace(/\//g, "."); }
  public handle(path: string, schema: z.ZodType, handler: (context: any) => unknown): this { this.registerHandler(this.routePath(path), schema, handler as any); return this; }
  public on(path: string, schema: z.ZodType, handler: (context: any) => unknown): this { return this.handle(path, schema, handler); }
  public receive(raw: unknown, runtimeContext: ElectronMainRuntimeContext, responseSend: (frame: ProtocolFrame) => unknown): void {
    if (!raw || typeof raw !== "object") return; const frame = raw as Record<string, any>;
    if (typeof frame.type !== "string" || typeof frame.id !== "string") return;
    if (frame.type === "response") { const request = this.pending.get(frame.id); if (!request) return; this.pending.delete(frame.id); frame.ok ? request.resolve(frame.output) : request.reject(new Error(String(frame.error?.message ?? frame.error ?? "Remote invoke failed"))); return; }
    if (frame.type !== "request" || typeof frame.route !== "string") return;
    void super.routeDispatch({ ...runtimeContext, path: this.routePath(frame.route), input: frame.input } as any).then((output: unknown) => responseSend({ type: "response", id: frame.id, ok: true, output }), (error: unknown) => responseSend({ type: "response", id: frame.id, ok: false, error: { message: String(error) } }));
  }
  public closePending(reason: unknown): void { for (const request of this.pending.values()) request.reject(reason); this.pending.clear(); }

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
    super();
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
