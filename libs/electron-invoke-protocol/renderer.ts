import {
  Remote,
  type context_t as CoreContext,
  type invokeProxy_t,
} from 'invoke-protocol';
import { invokeBridgeKey } from './public.ts';

export default function createElectronRenderer<
  remote extends { readonly routes: object },
>(): invokeProxy_t<remote['routes']> {
  const invoke = Reflect.get(globalThis, invokeBridgeKey);
  if (typeof invoke !== 'function') {
    throw new Error(
      'Electron preload bridge is missing; call ElectronPreload.dispatchInit() first',
    );
  }

  return new Remote<remote>().invokeProxyInit(
    invoke as (
      input: Pick<CoreContext, 'path' | 'input'>,
    ) => unknown | Promise<unknown>,
  );
}