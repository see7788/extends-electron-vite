import {
  Remote,
  type invokeProxy_t,
} from 'invoke-protocol';
import { invokeBridgeKey, type remote_t } from './public.ts';

export default function createElectronRenderer<
  remote extends remote_t,
>(): invokeProxy_t<remote['routes']> {
  const invoke = Reflect.get(globalThis, invokeBridgeKey);
  if (typeof invoke !== 'function') {
    throw new Error(
      'Electron preload bridge is missing; call ElectronPreload.dispatchInit() first',
    );
  }

  return new Remote<remote>().invokeProxyInit(input =>
    Reflect.apply(invoke, undefined, [input]),
  );
}
