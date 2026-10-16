import {
  contextBridge,
  ipcRenderer,
  type IpcRendererEvent,
} from 'electron';
import Base, {
  Remote,
  type context_t as CoreContext,
  type invokeProxy_t,
} from 'invoke-protocol';
import { invokeBridgeKey, invokeChannel } from './public.ts';

export interface context_t<remote extends object = object> extends CoreContext {
  readonly event: IpcRendererEvent;
  readonly invokeProxy: invokeProxy_t<remote>;
}

export class ElectronPreload<
  remote extends { readonly routes: object } = { readonly routes: object },
  context extends context_t<remote['routes']> = context_t<remote['routes']>,
> extends Base<context> {
  public override async dispatchInit({
    env = () => ({} as Omit<context, keyof context_t>),
  }: {
    readonly env?: () => Omit<context, keyof context_t>;
  } = {}): Promise<void> {
    let invokeProxy!: invokeProxy_t<remote['routes']>;
    let event!: IpcRendererEvent;
    let listener: ((message: unknown) => void) | undefined;

    const onMessage = (
      nextEvent: IpcRendererEvent,
      message: unknown,
    ): void => {
      event = nextEvent;
      try {
        listener?.(message);
      } finally {
        event = undefined!;
      }
    };

    this.invokeProxyFromSendOn(
      message => ipcRenderer.send(invokeChannel, message),
      nextListener => {
        listener = nextListener;
        ipcRenderer.on(invokeChannel, onMessage);
      },
      close => {
        window.addEventListener('unload', () => {
          ipcRenderer.off(invokeChannel, onMessage);
          listener = undefined;
          close();
        }, { once: true });
      },
      operation => ({
        ...env(),
        event,
        invokeProxy,
        path: operation.path,
        input: operation.input,
      } as Omit<context, 'router'>),
    );

    contextBridge.exposeInMainWorld(
      invokeBridgeKey,
      (input: Pick<CoreContext, 'path' | 'input'>) =>
        ipcRenderer.invoke(invokeChannel, input),
    );

    invokeProxy = new Remote<remote>().invokeProxyInit(
      input => ipcRenderer.invoke(invokeChannel, input),
    );
  }
}

export default function createElectronPreload<
  remote extends { readonly routes: object } = { readonly routes: object },
  context extends context_t<remote['routes']> = context_t<remote['routes']>,
>(): ElectronPreload<remote, context> {
  return new ElectronPreload<remote, context>();
}