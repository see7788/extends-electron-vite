import { join } from 'node:path'
import { app, clipboard, ipcMain, type WebContents } from 'electron'
import LoginState from 'extends-electron/loginState'
import PQueue from 'p-queue'
import { localCodexRuntimeFiles } from '../../userConfig'
import type {
  LocalCodexSetupAction,
  LocalCodexSetupActionResult,
  LocalCodexSetupState
} from './protocol'
import { localCodexSetupChannels } from './protocol'
import ChatGptPage from '../main.webContents/ChatGptPage'
import LocalCodexMcp from './LocalCodexMcp'
import LocalCodexWindowBase, {
  type LocalCodexMcpApi,
  type LocalCodexPageApi,
  type LocalCodexWindowBounds
} from './LocalCodexWindow'
import localCodexStoreCreate from './store'

export default class LocalCodexWindow extends LocalCodexWindowBase {
  private static readonly windowIds = new Set<symbol>()
  private static readonly windowLifecycleQueue = new PQueue({ concurrency: 1 })
  private static readonly setupEndpoints = new Map<number, LocalCodexWindow>()
  private static readonly store = localCodexStoreCreate()
  private static localMcp: LocalCodexMcp | undefined
  private static setupHandlersInstalled = false
  private readonly windowId = Symbol('local-codex-window')
  private localMcpReadyPromise: Promise<LocalCodexMcpApi> | undefined
  private setupWebContentsId: number | undefined
  private lifecycleOpened = false
  readonly ready: Promise<void>

  constructor() {
    super()
    this.ready = this.start()
  }

  protected localMcpReady(): Promise<LocalCodexMcpApi> {
    this.lifecycleOpened = true
    if (this.localMcpReadyPromise === undefined) {
      this.localMcpReadyPromise = LocalCodexWindow.windowOpen(this.windowId)
    }
    return this.localMcpReadyPromise
  }

  protected pageCreate(webContents: WebContents): LocalCodexPageApi {
    return new ChatGptPage(webContents)
  }

  protected windowClosed(): Promise<void> {
    this.setupIpcUninstall()
    if (!this.lifecycleOpened) return Promise.resolve()
    return LocalCodexWindow.windowClose(this.windowId)
  }

  protected async setupLoad(): Promise<void> {
    const webContents = this.setupWebContentsGet()
    this.setupIpcInstall(webContents)
    if (app.isPackaged) {
      await webContents.loadFile(
        join(app.getAppPath(), 'out', 'renderer', localCodexRuntimeFiles.setupRenderer)
      )
      return
    }
    const rendererUrl = process.env.ELECTRON_RENDERER_URL
    if (rendererUrl === undefined) throw new Error('Electron Vite renderer URL is unavailable in development')
    await webContents.loadURL(new URL(localCodexRuntimeFiles.setupRenderer, `${rendererUrl}/`).toString())
  }

  protected setupStatePublish(): void {
    const webContents = this.setupWebContentsGet()
    if (webContents.isDestroyed()) return
    webContents.send(localCodexSetupChannels.setupState, this.setupStateGet())
  }

  protected workspaceRootRead(): string | undefined {
    return LocalCodexWindow.store.getState().window.workspaceRoot
  }

  protected workspaceRootWrite(workspaceRoot: string): void {
    LocalCodexWindow.store.getState().windowActions.workspaceRootSet(workspaceRoot)
  }

  protected windowBoundsRead(): LocalCodexWindowBounds {
    return LocalCodexWindow.store.getState().window.bounds
  }

  protected windowBoundsWrite(windowBounds: LocalCodexWindowBounds): void {
    LocalCodexWindow.store.getState().windowActions.boundsSet(windowBounds)
  }

  protected windowMaximizedRead(): boolean {
    return LocalCodexWindow.store.getState().window.isMaximized
  }

  protected windowMaximizedWrite(isMaximized: boolean): void {
    LocalCodexWindow.store.getState().windowActions.isMaximizedSet(isMaximized)
  }

  private async setupAction(action: LocalCodexSetupAction): Promise<LocalCodexSetupActionResult> {
    switch (action.type) {
      case 'choose-workspace':
        await this.workspaceChoose()
        return {}
      case 'chatgpt-login-open':
        if (!this.loginOpenable(this.setupStateGet())) {
          throw new Error('请等待 Local MCP 就绪并选择有效工作区；ChatGPT 确认未登录后才可普通登录')
        }
        this.chatGptLoginOpen()
        return {}
      case 'chatgpt-reload':
        this.chatGptReload()
        return {}
      case 'login-state-copy':
        clipboard.writeText(await this.loginStateGet().textExport(action.username))
        return { username: action.username.trim() }
      case 'login-state-paste': {
        const username = await this.loginStateGet().textImport(clipboard.readText())
        this.chatGptReload()
        return { username }
      }
    }
  }

  private loginStateGet(): LoginState {
    return new LoginState({
      textPrefix: 'chatgpt-com-tocodex:v1:',
      webContents: this.chatGptWebContentsGet()
    })
  }

  private setupStateGet(): LocalCodexSetupState {
    const runtime = this.runtimeStateGet()
    const setupConditions = [
      { fulfilled: runtime.mcpReady, phase: 'mcp-starting' },
      {
        fulfilled: runtime.workspaceRoot !== undefined && runtime.workspaceReady,
        phase: 'needs-workspace'
      },
      { fulfilled: runtime.login === 'signed-in', phase: 'needs-login' }
    ] as const
    const pendingCondition = setupConditions.find(({ fulfilled }) => !fulfilled)
    return {
      ...runtime,
      phase: runtime.tone === 'error'
        ? 'error'
        : pendingCondition?.phase ?? 'ready'
    }
  }

  private loginOpenable(state: LocalCodexSetupState): boolean {
    return state.phase === 'needs-login' && state.login === 'signed-out'
  }

  private setupIpcInstall(webContents: WebContents): void {
    LocalCodexWindow.setupHandlersInstall()
    this.setupWebContentsId = webContents.id
    LocalCodexWindow.setupEndpoints.set(webContents.id, this)
  }

  private setupIpcUninstall(): void {
    const webContentsId = this.setupWebContentsId
    this.setupWebContentsId = undefined
    if (webContentsId === undefined) return
    LocalCodexWindow.setupEndpoints.delete(webContentsId)
    if (LocalCodexWindow.setupEndpoints.size !== 0) return
    ipcMain.removeHandler(localCodexSetupChannels.setupAction)
    ipcMain.removeHandler(localCodexSetupChannels.setupStateGet)
    LocalCodexWindow.setupHandlersInstalled = false
  }

  private static setupHandlersInstall(): void {
    if (LocalCodexWindow.setupHandlersInstalled) return
    ipcMain.handle(localCodexSetupChannels.setupAction, (event, action: LocalCodexSetupAction) => {
      return LocalCodexWindow.setupEndpointGet(event.sender.id).setupAction(action)
    })
    ipcMain.handle(localCodexSetupChannels.setupStateGet, (event) => {
      return LocalCodexWindow.setupEndpointGet(event.sender.id).setupStateGet()
    })
    LocalCodexWindow.setupHandlersInstalled = true
  }

  private static setupEndpointGet(webContentsId: number): LocalCodexWindow {
    const endpoint = LocalCodexWindow.setupEndpoints.get(webContentsId)
    if (endpoint === undefined) throw new Error('Local Codex setup IPC sender is not registered')
    return endpoint
  }

  private static windowOpen(windowId: symbol): Promise<LocalCodexMcp> {
    return LocalCodexWindow.windowLifecycleQueue.add(async () => {
      if (LocalCodexWindow.windowIds.has(windowId)) {
        throw new Error('Local Codex window lifecycle was opened twice')
      }

      LocalCodexWindow.windowIds.add(windowId)
      if (LocalCodexWindow.windowIds.size !== 1) return LocalCodexWindow.localMcpGet()
      if (LocalCodexWindow.localMcp !== undefined) {
        throw new Error('Local Codex MCP exists without any Local Codex windows')
      }

      const localMcp = new LocalCodexMcp()
      LocalCodexWindow.localMcp = localMcp
      return localMcp
    })
  }

  private static windowClose(windowId: symbol): Promise<void> {
    return LocalCodexWindow.windowLifecycleQueue.add(async () => {
      if (!LocalCodexWindow.windowIds.delete(windowId)) {
        throw new Error('Local Codex window lifecycle was closed before it opened')
      }
      if (LocalCodexWindow.windowIds.size !== 0) return

      await LocalCodexWindow.localMcpClose()
    })
  }

  private static async localMcpClose(): Promise<void> {
    const localMcp = LocalCodexWindow.localMcpGet()
    await localMcp.close()
    LocalCodexWindow.localMcp = undefined
  }

  private static localMcpGet(): LocalCodexMcp {
    if (LocalCodexWindow.localMcp === undefined) {
      throw new Error('Local Codex MCP is not available for an active Local Codex window')
    }
    return LocalCodexWindow.localMcp
  }
}
