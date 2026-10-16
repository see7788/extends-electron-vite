import {
  ipcMain,
  type BrowserWindow,
  type IpcMainEvent,
  type IpcMainInvokeEvent,
  type WebContents,
} from 'electron';
import Base, {
  type context_t as CoreContext,
  type invokeProxy_t,
} from 'invoke-protocol';
import { invokeChannel } from './public.ts';

export interface context_t<remote extends object = object> extends CoreContext {
  readonly event: IpcMainEvent | IpcMainInvokeEvent;
  readonly webContents: WebContents;
  readonly invokeProxy: invokeProxy_t<remote>;
}

export class ElectronMain<
  remote extends { readonly routes: object } = { readonly routes: object },
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

    let invokeProxy!: invokeProxy_t<remote['routes']>;
    let event!: IpcMainEvent | IpcMainInvokeEvent;
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
      ipcMain.off(invokeChannel, onMessage);
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

    invokeProxy = this.invokeProxyFromSendOn(
      message => {
        if (webContents.isDestroyed()) {
          throw new Error('Electron WebContents is destroyed');
        }
        webContents.send(invokeChannel, message);
      },
      listener => {
        receive = listener;
        ipcMain.on(invokeChannel, onMessage);
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
    ) as unknown as invokeProxy_t<remote['routes']>;
  }
}

export default function createElectronMain<
  remote extends { readonly routes: object } = { readonly routes: object },
  context extends context_t<remote['routes']> = context_t<remote['routes']>,
>(): ElectronMain<remote, context> {
  return new ElectronMain<remote, context>();
}