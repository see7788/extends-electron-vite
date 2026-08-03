import { contextBridge, ipcRenderer } from 'electron'
import { localCodexChatGptChannels } from './protocol'

export type LocalCodexChatGptBridge = {
  report(payload: string): void
}

const localCodexChatGptBridge = {
  report(payload: string): void {
    if (typeof payload !== 'string') throw new TypeError('Local Codex page event payload must be a string')
    ipcRenderer.send(localCodexChatGptChannels.pageEvent, payload)
  }
} satisfies LocalCodexChatGptBridge

declare global {
  interface Window {
    localCodexPageEvent: LocalCodexChatGptBridge
  }
}

contextBridge.exposeInMainWorld('localCodexPageEvent', localCodexChatGptBridge)
