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
import {
  duplexChannel,
  invokeBridgeKey,
  invokeChannel,
  type remote_t,
} from './public.ts';

export interface context_t<routes extends object = object> extends CoreContext {
  readonly event: IpcRendererEvent;
  readonly invokeProxy: invokeProxy_t<routes>;
}

export default class ElectronPreload<
  remote extends remote_t = remote_t,
  context extends context_t<remote['routes']> = context_t<remote['routes']>,
> extends Base<context> {
  public override async dispatchInit({
    env = () => ({} as Omit<context, keyof context_t>),
  }: {
    readonly env?: () => Omit<context, keyof context_t>;
  } = {}): Promise<void> {
    let event!: IpcRendererEvent;
    let invokeProxy!: invokeProxy_t<remote['routes']>;
    let receive: ((message: unknown) => void) | undefined;

    const onMessage = (
      nextEvent: IpcRendererEvent,
      message: unknown,
    ): void => {
      event = nextEvent;
      try {
        receive?.(message);
      } finally {
        event = undefined!;
      }
    };

    invokeProxy = new Remote<remote>().invokeProxyFromSendOn(
      message => ipcRenderer.send(duplexChannel, message),
      listener => {
        receive = listener;
        ipcRenderer.on(duplexChannel, onMessage);
      },
      close => {
        window.addEventListener(
          'unload',
          () => {
            ipcRenderer.off(duplexChannel, onMessage);
            receive = undefined;
            close();
          },
          { once: true },
        );
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
  }
}
