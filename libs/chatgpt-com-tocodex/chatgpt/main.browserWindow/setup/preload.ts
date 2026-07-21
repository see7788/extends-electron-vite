import { contextBridge, ipcRenderer } from 'electron'
import {
  localCodexSetupChannels,
  type LocalCodexSetupAction,
  type LocalCodexSetupActionResult,
  type LocalCodexSetupState
} from '../protocol'

export type LocalCodexSetupBridge = {
  action(action: LocalCodexSetupAction): Promise<LocalCodexSetupActionResult>
  stateGet(): Promise<LocalCodexSetupState>
  stateSubscribe(listener: (state: LocalCodexSetupState) => void): () => void
}

const localCodexSetupBridge = {
  action(action: LocalCodexSetupAction): Promise<LocalCodexSetupActionResult> {
    return ipcRenderer.invoke(localCodexSetupChannels.setupAction, action) as Promise<LocalCodexSetupActionResult>
  },
  stateGet(): Promise<LocalCodexSetupState> {
    return ipcRenderer.invoke(localCodexSetupChannels.setupStateGet) as Promise<LocalCodexSetupState>
  },
  stateSubscribe(listener: (state: LocalCodexSetupState) => void): () => void {
    const eventListener = (_event: Electron.IpcRendererEvent, state: LocalCodexSetupState) => listener(state)
    ipcRenderer.on(localCodexSetupChannels.setupState, eventListener)
    return () => ipcRenderer.removeListener(localCodexSetupChannels.setupState, eventListener)
  }
} satisfies LocalCodexSetupBridge

declare global {
  interface Window {
    localCodexSetup: LocalCodexSetupBridge
  }
}

contextBridge.exposeInMainWorld('localCodexSetup', localCodexSetupBridge)
