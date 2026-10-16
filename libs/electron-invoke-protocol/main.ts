import {
  ipcMain,
  type BrowserWindow,
  type IpcMainEvent,
  type IpcMainInvokeEvent,
  type WebContents,
} from 'electron';
import Base, {
  Remote,
  type context_t as CoreContext,
  type invokeProxy_t,
} from 'invoke-protocol';
import {
  duplexChannel,
  invokeChannel,
  type remote_t,
} from './public.ts';

export interface context_t<routes extends object = object> extends CoreContext {
  readonly event: IpcMainEvent | IpcMainInvokeEvent;
  readonly webContents: WebContents;
  readonly invokeProxy: invokeProxy_t<routes>;
}

export default class ElectronMain<
  remote extends remote_t = remote_t,
  context extends context_t<remote['routes']> = context_t<remote['routes']>,
> extends Base<context> {
  public override async dispatchInit({
    browser,
    env = () => ({} as Omit<context, keyof context_t>),
  }: {
    readonly browser: BrowserWindow;
    readonly env?: () => Omit<context, keyof context_t>;
  }): Promise<void> {
    const { webContents } = browser;
    if (webContents.isDestroyed()) {
      throw new Error('Electron WebContents is destroyed');
    }

    let event!: IpcMainEvent | IpcMainInvokeEvent;
    let invokeProxy!: invokeProxy_t<remote['routes']>;
    let receive: ((message: unknown) => void) | undefined;

    const onMessage = (nextEvent: IpcMainEvent, message: unknown): void => {
      if (nextEvent.sender !== webContents) return;
      event = nextEvent;
      try {
        receive?.(message);
      } finally {
        event = undefined!;
      }
    };
    const detach = (onClose?: () => void): void => {
      ipcMain.off(duplexChannel, onMessage);
      if (onClose) {
        webContents.off('destroyed', onClose);
        webContents.off('render-process-gone', onClose);
      }
      receive = undefined;
    };

    webContents.ipc.handle(
      invokeChannel,
      (nextEvent, input: Pick<CoreContext, 'path' | 'input'>) => {
        event = nextEvent;
        try {
          return this.dispatchRoute({
            ...input,
            ...env(),
            event,
            webContents,
            invokeProxy,
          } as Omit<context, 'router'>);
        } finally {
          event = undefined!;
        }
      },
    );

    invokeProxy = new Remote<remote>().invokeProxyFromSendOn(
      message => {
        if (webContents.isDestroyed()) {
          throw new Error('Electron WebContents is destroyed');
        }
        webContents.send(duplexChannel, message);
      },
      listener => {
        receive = listener;
        ipcMain.on(duplexChannel, onMessage);
      },
      listener => {
        const handleClose = (): void => {
          detach(handleClose);
          listener();
        };
        webContents.once('destroyed', handleClose);
        webContents.once('render-process-gone', handleClose);
      },
      operation => ({
        ...env(),
        event,
        webContents,
        invokeProxy,
        path: operation.path,
        input: operation.input,
      } as Omit<context, 'router'>),
    );
  }
}
