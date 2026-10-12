import { app, dialog, ipcMain, type App, type BrowserWindow, type Dialog, type IpcMainEvent, type WebContents } from "electron";
import { z } from "zod";
import Base, {
  type invokeProxy_t,
  type rpc_t,
} from "invoke-protocol";
import { electronIpcChannel as channel } from "./protocol.ts";

type EmptyRoute = {
  readonly validator: undefined;
  readonly handler: (...args: any[]) => unknown;
};

type ElectronWindowRoutes = {
  "electron.window.show": EmptyRoute;
  "electron.window.hide": EmptyRoute;
  "electron.window.focus": EmptyRoute;
  "electron.window.blur": EmptyRoute;
  "electron.window.reload": EmptyRoute;
  "electron.window.minimize": EmptyRoute;
  "electron.window.maximize": EmptyRoute;
  "electron.window.unmaximize": EmptyRoute;
  "electron.window.restore": EmptyRoute;
  "electron.window.close": EmptyRoute;
  "electron.window.isVisible": EmptyRoute & { readonly handler: () => boolean };
  "electron.window.isFocused": EmptyRoute & { readonly handler: () => boolean };
  "electron.window.isMinimized": EmptyRoute & { readonly handler: () => boolean };
  "electron.window.isMaximized": EmptyRoute & { readonly handler: () => boolean };
  "electron.window.isDestroyed": EmptyRoute & { readonly handler: () => boolean };
};

type ElectronAppRoutes = {
  "electron.app.version": EmptyRoute & { readonly handler: () => string };
  "electron.app.name": EmptyRoute & { readonly handler: () => string };
  "electron.app.is-packaged": EmptyRoute & { readonly handler: () => boolean };
  "electron.app.path": {
    readonly validator: typeof appPathSchema;
    readonly handler: (context: { readonly input: z.infer<typeof appPathSchema> }) => string;
  };
};

type ElectronDialogRoutes = {
  "electron.dialog.message": {
    readonly validator: typeof dialogMessageSchema;
    readonly handler: (context: { readonly input: z.infer<typeof dialogMessageSchema> }) => Promise<Electron.MessageBoxReturnValue>;
  };
};

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

export type ElectronMainRuntimeContext<routers extends object = {}> = {
  readonly event: IpcMainEvent;
  readonly webContents: WebContents;
  readonly invokeProxy: invokeProxy_t<routers>;
};

export type ElectronMainRoutes = ElectronWindowRoutes & ElectronAppRoutes & ElectronDialogRoutes;

export default abstract class ElectronMain<
  env extends object = {},
  routers extends object = {},
> extends Base<
  routers,
  rpc_t & env & ElectronMainRuntimeContext<routers>
> {
  public invokeProxy!: invokeProxy_t<routers>;

  public override async dispatchInit({
    webContents,
    env = () => ({} as env),
  }: {
    readonly webContents: WebContents;
    readonly env?: () => env;
  }): Promise<void> {
    if (this.invokeProxy) return;
    if (webContents.isDestroyed()) throw new Error("Electron WebContents is destroyed");

    let receive: ((message: unknown) => void) | undefined;
    let event: IpcMainEvent | undefined;
    const onMessage = (senderEvent: IpcMainEvent, message: unknown): void => {
      if (senderEvent.sender !== webContents) return;
      event = senderEvent;
      receive?.(message);
      event = undefined;
    };

    this.invokeProxy = this.invokeProxyFromSendOn(
      message => {
        if (webContents.isDestroyed()) throw new Error("Electron WebContents is destroyed");
        webContents.send(channel, message);
      },
      listener => {
        receive = listener;
        ipcMain.on(channel, onMessage);
      },
      listener => {
        const close = (): void => {
          ipcMain.off(channel, onMessage);
          webContents.off("destroyed", close);
          webContents.off("render-process-gone", close);
          receive = undefined;
          listener();
        };
        webContents.on("destroyed", close);
        webContents.on("render-process-gone", close);
      },
      ({ invokeProxy, path, input }) => ({
        ...env(),
        event: event as IpcMainEvent,
        webContents,
        invokeProxy,
        path,
        input,
      }),
    );
  }

  public browserWindow<Self extends this>(
    this: Self,
    window: BrowserWindow,
  ): Self & { readonly routers: Self["routers"] & ElectronWindowRoutes } {
    this.registerHandler("electron.window.show", () => { window.show(); });
    this.registerHandler("electron.window.hide", () => { window.hide(); });
    this.registerHandler("electron.window.focus", () => { window.focus(); });
    this.registerHandler("electron.window.blur", () => { window.blur(); });
    this.registerHandler("electron.window.reload", () => { window.reload(); });
    this.registerHandler("electron.window.minimize", () => { window.minimize(); });
    this.registerHandler("electron.window.maximize", () => { window.maximize(); });
    this.registerHandler("electron.window.unmaximize", () => { window.unmaximize(); });
    this.registerHandler("electron.window.restore", () => { window.restore(); });
    this.registerHandler("electron.window.close", () => { window.close(); });
    this.registerHandler("electron.window.isVisible", () => window.isVisible());
    this.registerHandler("electron.window.isFocused", () => window.isFocused());
    this.registerHandler("electron.window.isMinimized", () => window.isMinimized());
    this.registerHandler("electron.window.isMaximized", () => window.isMaximized());
    this.registerHandler("electron.window.isDestroyed", () => window.isDestroyed());
    return this as Self & { readonly routers: Self["routers"] & ElectronWindowRoutes };
  }

  public app<Self extends this>(
    this: Self,
    appApi: App = app,
  ): Self & { readonly routers: Self["routers"] & ElectronAppRoutes } {
    this.registerHandler("electron.app.version", () => appApi.getVersion());
    this.registerHandler("electron.app.name", () => appApi.getName());
    this.registerHandler("electron.app.is-packaged", () => appApi.isPackaged);
    this.registerHandler("electron.app.path", appPathSchema, ({ input }) => appApi.getPath(input.name));
    return this as Self & { readonly routers: Self["routers"] & ElectronAppRoutes };
  }

  public dialog<Self extends this>(
    this: Self,
    dialogApi: Dialog = dialog,
  ): Self & { readonly routers: Self["routers"] & ElectronDialogRoutes } {
    this.registerHandler("electron.dialog.message", dialogMessageSchema, ({ input }) => dialogApi.showMessageBox(input));
    return this as Self & { readonly routers: Self["routers"] & ElectronDialogRoutes };
  }
}

export { channel as electronIpcChannel };
export type { ElectronWindowRoutes, ElectronAppRoutes, ElectronDialogRoutes };
