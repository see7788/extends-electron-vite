import { createHash } from 'node:crypto'
import { basename, join, resolve } from 'node:path'
import {
  app,
  BrowserWindow,
  Menu,
  session,
  WebContentsView,
  type MenuItemConstructorOptions,
  type WebContents
} from 'electron'
import { dialog } from 'electron/main'
import log from 'electron-log/main'
import { z } from 'zod'
import { localCodexRuntimeFiles } from '../../userConfig'
import {
  type McpStatusTone,
  type McpToolCall,
  type McpToolExecution
} from './LocalCodexMcp'
import { localCodexChatGptChannels } from '../preload/protocol'
import type { LocalCodexPageSnapshot } from '../main.webContents/protocol'

const CHATGPT_URL = 'https://chatgpt.com/'
const MAX_CALLS_PER_TURN = 8

const McpToolCallSchema = z.object({
  id: z.string().min(1).max(160),
  name: z.string().min(1).max(240),
  arguments: z.record(z.string(), z.unknown()).default({})
})

const McpToolCallsSchema = z.object({
  calls: z.array(McpToolCallSchema).min(1).max(MAX_CALLS_PER_TURN)
})

const PageSnapshotSchema = z.object({
  href: z.string().min(1),
  assistantCount: z.number().int().nonnegative(),
  userCount: z.number().int().nonnegative(),
  text: z.string(),
  streaming: z.boolean(),
  ready: z.boolean(),
  draft: z.string()
})

export type LocalCodexPageApi = {
  reset(): void
  install(): Promise<boolean>
  setStatus(message: string, tone?: McpStatusTone): Promise<void>
  observe(): Promise<void>
  snapshot(): Promise<LocalCodexPageSnapshot>
  send(message: string): Promise<void>
}

export type LocalCodexMcpApi = {
  readonly toolCount: number
  readonly workspaceReady: boolean
  statusSubscribe(listener: (message: string, tone: McpStatusTone) => void): () => void
  workspaceConfigure(workspaceRoot: string): Promise<void>
  promptTools(): Array<{
    name: string
    description: string
    input_schema: Record<string, unknown>
  }>
  call(call: McpToolCall): Promise<McpToolExecution>
  close(): Promise<void>
}

export type LocalCodexWindowRuntimeState = {
  login: 'checking' | 'signed-in' | 'signed-out'
  message: string
  mcpReady: boolean
  tone: McpStatusTone
  toolCount: number
  workspaceReady: boolean
  workspaceRoot: string | undefined
}

export type LocalCodexWindowBounds = {
  height: number
  width: number
  x?: number
  y?: number
}

function protocolJson(value: unknown, space = 0): string {
  const serialized = JSON.stringify(value, undefined, space)
  if (serialized === undefined) throw new TypeError('Local Codex protocol payload is not JSON serializable')
  return serialized
}

function shortHash(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 20)
}

function errorText(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`
  return String(error)
}

export default abstract class LocalCodexWindow {
  private window: BrowserWindow | undefined
  private chatGptView: WebContentsView | undefined
  private page: LocalCodexPageApi | undefined
  private statusUnsubscribe: (() => void) | undefined
  private pageEventBusy = false
  private pageEventPending: LocalCodexPageSnapshot | undefined
  private pageReady: boolean | undefined
  private activeConversation = ''
  private bootstrappedConversation = ''
  private bootstrapSentAt = 0
  private readonly processedResponses = new Set<string>()
  private readonly completedCalls = new Map<string, McpToolExecution>()
  private status = '正在启动…'
  private statusTone: McpStatusTone = 'warn'
  private localMcp: LocalCodexMcpApi | undefined
  private lifecycleClosePromise: Promise<void> | undefined

  protected abstract localMcpReady(): Promise<LocalCodexMcpApi>

  protected abstract pageCreate(webContents: WebContents): LocalCodexPageApi

  protected abstract windowClosed(): Promise<void>

  protected abstract setupLoad(): Promise<void>

  protected abstract setupStatePublish(): void

  protected abstract workspaceRootRead(): string | undefined

  protected abstract workspaceRootWrite(workspaceRoot: string): void

  protected abstract windowBoundsRead(): LocalCodexWindowBounds

  protected abstract windowBoundsWrite(windowBounds: LocalCodexWindowBounds): void

  protected abstract windowMaximizedRead(): boolean

  protected abstract windowMaximizedWrite(isMaximized: boolean): void

  protected async start(): Promise<void> {
    const chatGptWebContents = this.createWindow()
    this.installMenu()
    this.updateStatus('正在启动本机 Local MCP…', 'warn')
    const localMcpReady = this.localMcpReady()
    try {
      const setupLoad = this.setupLoad().then(
        () => ({ kind: 'loaded' as const }),
        (error: unknown) => ({ error, kind: 'failed' as const })
      )
      this.setupShow()
      const chatGptLoad = chatGptWebContents.loadURL(CHATGPT_URL).then(
        () => ({ kind: 'loaded' as const }),
        (error: unknown) => ({ error, kind: 'failed' as const })
      )
      this.localMcp = await localMcpReady
      this.statusUnsubscribe = this.localMcpGet().statusSubscribe((message, tone) => {
        this.updateStatus(message, tone)
      })
      await this.workspaceRestore()
      this.setupStatePublish()
      const [setupLoadResult, chatGptLoadResult] = await Promise.all([setupLoad, chatGptLoad])
      if (setupLoadResult.kind === 'failed') throw setupLoadResult.error
      if (chatGptLoadResult.kind === 'failed') throw chatGptLoadResult.error
    } catch (error) {
      const message = `Local Codex 启动失败：${errorText(error)}`
      log.error(message, error)
      this.updateStatus(message, 'error')
      this.setupShow()
    }
  }

  private localMcpGet(): LocalCodexMcpApi {
    if (this.localMcp === undefined) {
      throw new Error('Local Codex MCP is unavailable after Local Codex window startup')
    }
    return this.localMcp
  }

  private lifecycleClose(): Promise<void> {
    if (this.lifecycleClosePromise === undefined) {
      this.lifecycleClosePromise = this.windowClosed()
    }
    return this.lifecycleClosePromise
  }

  private createWindow(): WebContents {
    const windowBounds = this.windowBoundsRead()
    this.windowBoundsWrite(windowBounds)
    const window = new BrowserWindow({
      ...windowBounds,
      minWidth: 900,
      minHeight: 640,
      show: false,
      backgroundColor: '#111827',
      autoHideMenuBar: false,
      title: 'Local Codex 设置',
      webPreferences: {
        preload: join(app.getAppPath(), 'out', 'preload', localCodexRuntimeFiles.setupPreload),
        contextIsolation: true,
        sandbox: true,
        nodeIntegration: false,
        webSecurity: true
      }
    })
    this.window = window
    const chatGptView = new WebContentsView({
      webPreferences: {
        partition: 'persist:local-codex-chatgpt',
        preload: join(app.getAppPath(), 'out', 'preload', localCodexRuntimeFiles.chatGptPreload),
        contextIsolation: true,
        sandbox: true,
        nodeIntegration: false,
        webSecurity: true
      }
    })
    this.chatGptView = chatGptView
    window.contentView.addChildView(chatGptView)
    this.chatGptViewResize()
    chatGptView.setVisible(false)
    this.page = this.pageCreate(chatGptView.webContents)

    const ses = session.fromPartition('persist:local-codex-chatgpt')
    ses.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false))

    const chatGptWebContents = chatGptView.webContents
    chatGptWebContents.on('dom-ready', () => {
      void this.installPageAdapter()
        .catch((error) => {
          const message = `ChatGPT page adapter initialization failed: ${errorText(error)}`
          log.error(message, error)
          this.updateStatus(message, 'error')
        })
    })
    chatGptWebContents.on('ipc-message', (_event, channel, payload) => {
      if (channel === localCodexChatGptChannels.pageEvent) {
        if (typeof payload !== 'string') {
          const message = 'Local Codex page event payload must be a string'
          log.error(message, payload)
          this.updateStatus(message, 'error')
          return
        }
        this.pageEventReceive(payload)
        return
      }
    })
    chatGptWebContents.on('did-navigate-in-page', (_event, url) => this.onNavigation(url))
    chatGptWebContents.on('did-navigate', (_event, url) => this.onNavigation(url))
    chatGptWebContents.on('render-process-gone', (_event, details) => {
      log.error('ChatGPT renderer process gone', details)
    })
    window.webContents.once('did-finish-load', () => this.setupStatePublish())
    window.on('resize', () => {
      this.chatGptViewResize()
      this.windowBoundsWrite(window.getNormalBounds())
      this.windowMaximizedWrite(window.isMaximized())
    })
    window.on('move', () => {
      this.windowBoundsWrite(window.getNormalBounds())
    })
    window.on('maximize', () => {
      this.windowMaximizedWrite(true)
    })
    window.on('unmaximize', () => {
      this.windowMaximizedWrite(false)
    })
    if (this.windowMaximizedRead()) window.maximize()
    window.on('closed', () => {
      this.window = undefined
      this.chatGptView = undefined
      this.page = undefined
      this.pageEventPending = undefined
      this.pageReady = undefined
      this.statusUnsubscribe?.()
      this.statusUnsubscribe = undefined
      void this.lifecycleClose().catch((error) => {
        log.error('Local Codex window shutdown failed', error)
      })
    })
    return chatGptWebContents
  }

  protected setupShow(): void {
    const window = this.window
    const chatGptView = this.chatGptView
    if (window === undefined || window.isDestroyed() || chatGptView === undefined) return
    chatGptView.setVisible(false)
    window.setTitle('Local Codex 设置')
    window.setAlwaysOnTop(true)
    window.show()
    window.focus()
    window.webContents.focus()
  }

  protected setupHide(): void {
    this.chatGptShow()
  }

  private chatGptShow(): void {
    const window = this.hostWindowGet()
    const chatGptView = this.chatGptViewGet()
    chatGptView.setVisible(true)
    window.setTitle('Local Codex — ChatGPT')
    window.setAlwaysOnTop(false)
    window.show()
    window.focus()
    chatGptView.webContents.focus()
  }

  private chatGptViewResize(): void {
    const window = this.window
    const chatGptView = this.chatGptView
    if (window === undefined || window.isDestroyed() || chatGptView === undefined) return
    const [width, height] = window.getContentSize()
    chatGptView.setBounds({ height, width, x: 0, y: 0 })
  }

  private async installPageAdapter(): Promise<void> {
    const page = this.page
    if (!page) throw new Error('ChatGPT page adapter is unavailable')
    page.reset()
    this.pageReady = undefined
    await page.install()
    await page.setStatus(this.status, this.statusTone)
    await page.observe()
  }

  private installMenu(): void {
    const template: MenuItemConstructorOptions[] = []
    if (process.platform === 'darwin') template.push({ role: 'appMenu' })
    template.push(
      {
        label: '本地 Codex',
        submenu: [
          {
            label: '打开 Local Codex 设置…',
            accelerator: 'CmdOrCtrl+Shift+O',
            click: () => this.setupShow()
          },
          {
            label: '初始化当前对话',
            accelerator: 'CmdOrCtrl+Shift+L',
            click: () => {
              void this.conversationInitialize().catch((error) => this.uiActionFailed('初始化当前对话', error))
            }
          },
          { type: 'separator' },
          {
            label: '打开 ChatGPT 开发者工具',
            accelerator: 'CmdOrCtrl+Alt+I',
            click: () => this.chatGptWebContentsGet().toggleDevTools()
          },
          {
            label: '重新加载 ChatGPT',
            accelerator: 'CmdOrCtrl+R',
            click: () => this.chatGptReload()
          },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      { role: 'editMenu' },
      { role: 'viewMenu' }
    )
    this.window?.setMenu(Menu.buildFromTemplate(template))
  }

  protected async workspaceChoose(): Promise<void> {
    const window = this.hostWindowGet()
    const workspaceRoot = this.workspaceRoot
    const selection = await dialog.showOpenDialog(window, {
      title: '选择 Local Codex 工作区',
      ...(workspaceRoot ? { defaultPath: workspaceRoot } : {}),
      properties: ['openDirectory', 'createDirectory']
    })
    const selected = selection.filePaths[0]
    if (selection.canceled || !selected) {
      this.updateStatus('尚未选择工作区', 'warn')
      return
    }
    const selectedWorkspaceRoot = resolve(selected)
    await this.localMcpGet().workspaceConfigure(selectedWorkspaceRoot)
    this.workspaceRootWrite(selectedWorkspaceRoot)
    this.bootstrappedConversation = ''
    this.updateStatus(`工作区已验证：${this.workspaceRootRequired}`, 'ok')
    this.setupStatePublish()
    if (this.pageReady === true) this.setupHide()
  }

  protected get workspaceRoot(): string | undefined {
    return this.workspaceRootRead()
  }

  private async workspaceRestore(): Promise<void> {
    const workspaceRoot = this.workspaceRoot
    if (workspaceRoot === undefined) return
    try {
      await this.localMcpGet().workspaceConfigure(workspaceRoot)
      this.updateStatus(`工作区已验证：${this.workspaceRootRequired}`, 'ok')
      if (this.pageReady === true) this.setupHide()
    } catch (error) {
      const message = `已保存的 Local Codex 工作区不可用：${errorText(error)}`
      log.error(message, error)
      this.updateStatus(message, 'error')
    }
  }

  private get workspaceRootRequired(): string {
    const workspaceRoot = this.workspaceRoot
    if (!workspaceRoot) throw new Error('Local Codex workspace has not been selected')
    return workspaceRoot
  }

  protected uiActionFailed(action: string, error: unknown): void {
    const message = `Local Codex ${action}失败：${errorText(error)}`
    log.error(message, error)
    this.updateStatus(message, 'error')
  }

  private onNavigation(url: string): void {
    if (!url.startsWith('https://chatgpt.com')) return
    const next = this.conversationKey(url)
    if (next === this.activeConversation) return

    const promotedNewChat =
      this.activeConversation === 'new' &&
      next.startsWith('chat:') &&
      Date.now() - this.bootstrapSentAt < 120_000

    this.activeConversation = next
    if (promotedNewChat) this.bootstrappedConversation = next
    else {
      this.bootstrappedConversation = ''
      // Protocol exception: call IDs are only unique inside one ChatGPT conversation.
      this.completedCalls.clear()
    }
  }

  private conversationKey(url: string): string {
    const parsed = new URL(url)
    const match = parsed.pathname.match(/^\/c\/([^/]+)/)
    return match ? `chat:${match[1]}` : parsed.pathname === '/' ? 'new' : `page:${parsed.pathname}`
  }

  protected updateStatus(message: string, tone: McpStatusTone = 'warn'): void {
    this.status = message
    this.statusTone = tone
    this.setupStatePublish()
    const page = this.page
    if (page) {
      void page.setStatus(message, tone).catch((error) => {
        log.error('ChatGPT page status update failed', error)
      })
    }
    if (tone === 'error') {
      this.setupShow()
    }
  }

  private pageEventReceive(payload: string): void {
    let value: unknown
    try {
      value = JSON.parse(payload)
    } catch (error) {
      const message = `Local Codex page event is not JSON: ${errorText(error)}`
      log.error(message, error)
      this.updateStatus(message, 'error')
      return
    }
    const parsed = PageSnapshotSchema.safeParse(value)
    if (!parsed.success) {
      const message = `Local Codex page event is invalid: ${z.prettifyError(parsed.error)}`
      log.error(message)
      this.updateStatus(message, 'error')
      return
    }
    this.pageEventPending = parsed.data
    if (this.pageEventBusy) return
    this.pageEventBusy = true
    void this.pageEventDrain()
  }

  private async pageEventDrain(): Promise<void> {
    try {
      while (this.pageEventPending) {
        const snapshot = this.pageEventPending
        this.pageEventPending = undefined
        await this.pageSnapshotHandle(snapshot)
      }
    } catch (error) {
      this.pageEventPending = undefined
      const message = `ChatGPT page event handling failed: ${errorText(error)}`
      log.error(message, error)
      this.updateStatus(message, 'error')
    } finally {
      this.pageEventBusy = false
    }
  }

  private async pageSnapshotHandle(snapshot: LocalCodexPageSnapshot): Promise<void> {
    if (!this.page) return
    if (this.pageReady !== snapshot.ready) {
      this.pageReady = snapshot.ready
      this.setupStatePublish()
    }
    if (!snapshot.ready) {
      this.setupShow()
      this.updateStatus('请先登录 ChatGPT', 'warn')
      return
    }
    if (this.localMcp?.workspaceReady) this.setupHide()
    else this.setupShow()
    const conversation = this.conversationKey(snapshot.href)
    if (conversation !== this.activeConversation) this.onNavigation(snapshot.href)
    if (this.bootstrappedConversation !== this.activeConversation) return
    if (snapshot.streaming || !snapshot.text.trim()) return

    const responseId = `${conversation}:${snapshot.assistantCount}:${shortHash(snapshot.text)}`
    if (this.processedResponses.has(responseId)) return
    this.processedResponses.add(responseId)
    await this.handleAssistantResponse(snapshot.text)
  }

  protected async conversationInitialize(): Promise<void> {
    if (this.pageReady !== true) throw new Error('请先登录 ChatGPT')
    if (!this.localMcpGet().workspaceReady) throw new Error('请先选择并确认 Local Codex 工作区')
    this.chatGptShow()
    this.bootstrappedConversation = ''
    await this.bootstrapCurrentConversation()
  }

  protected chatGptLoginOpen(): void {
    this.chatGptShow()
  }

  protected chatGptReload(): void {
    this.chatGptWebContentsGet().reload()
  }

  protected chatGptWebContentsGet(): WebContents {
    return this.chatGptViewGet().webContents
  }

  protected runtimeStateGet(): LocalCodexWindowRuntimeState {
    const localMcp = this.localMcp
    return {
      login: this.pageReady === undefined ? 'checking' : this.pageReady ? 'signed-in' : 'signed-out',
      message: this.status,
      mcpReady: localMcp !== undefined,
      tone: this.statusTone,
      toolCount: localMcp?.toolCount ?? 0,
      workspaceReady: localMcp?.workspaceReady ?? false,
      workspaceRoot: this.workspaceRoot
    }
  }

  protected hostWindowGet(): BrowserWindow {
    const window = this.window
    if (window === undefined || window.isDestroyed()) throw new Error('Local Codex host window is unavailable')
    return window
  }

  protected setupWebContentsGet(): WebContents {
    return this.hostWindowGet().webContents
  }

  private chatGptViewGet(): WebContentsView {
    const chatGptView = this.chatGptView
    if (chatGptView === undefined || chatGptView.webContents.isDestroyed()) {
      throw new Error('Local Codex ChatGPT view is unavailable')
    }
    return chatGptView
  }

  private async bootstrapCurrentConversation(): Promise<void> {
    const localMcp = this.localMcp
    if (!localMcp) {
      throw new Error('本机 Local MCP 正在启动')
    }
    if (!this.page || !localMcp.workspaceReady) {
      throw new Error('请选择 Local Codex 工作区后再初始化当前对话')
    }
    if (!this.workspaceRoot) {
      throw new Error('尚未选择 Local Codex 工作区')
    }
    const snapshot = await this.page.snapshot()
    if (!snapshot.ready) throw new Error('请先登录 ChatGPT')
    if (snapshot.streaming) {
      this.updateStatus('请等待当前回复完成后再初始化 Local Codex', 'warn')
      return
    }
    if (snapshot.draft.trim()) {
      this.updateStatus('输入框中有未发送内容；请发送或清空后再初始化', 'warn')
      return
    }

    const prompt = this.buildBootstrapPrompt()
    this.updateStatus(`正在初始化：${localMcp.toolCount} 个本地工具…`, 'warn')
    await this.page.send(prompt)
    this.bootstrapSentAt = Date.now()
    this.activeConversation = this.conversationKey(snapshot.href)
    this.bootstrappedConversation = this.activeConversation
    this.updateStatus(`Local Codex 已启用 · ${localMcp.toolCount} 个工具 · ${basename(this.workspaceRootRequired)}`, 'ok')
  }

  private buildBootstrapPrompt(): string {
    const allTools = this.localMcpGet().promptTools()
    const toolJson = protocolJson(allTools, 2)
    return `You are connected to a LOCAL_CODEX_BRIDGE hosted by this Electron application.

The bridge contains an in-process Local MCP implementation. It executes the listed tools directly inside this Electron application's main process; it does not use an MCP-Gateway, HTTP endpoint, OAuth flow, tunnel, or external service. You must use these tools whenever the user's request needs local files, code search, edits, commands, tests, or other listed capabilities. Never claim that you cannot access the local project before attempting the appropriate tool.

WORKSPACE_ROOT: ${this.workspaceRootRequired}

PROTOCOL (mandatory):
1. To call tools, reply with exactly one block and no surrounding prose:
<<<LOCAL_CODEX_CALLS>>>
{"calls":[{"id":"unique-call-id","name":"exact_tool_name","arguments":{}}]}
<<<END_LOCAL_CODEX_CALLS>>>
2. You may request up to ${MAX_CALLS_PER_TURN} independent calls in one block. Keep dependent calls in separate turns.
3. The host replies between LOCAL_CODEX_RESULTS markers. Continue from those real results.
4. Never fabricate a tool result. Never repeat a completed call id.
5. When the task is complete, answer normally without protocol tags.
6. All file operations outside WORKSPACE_ROOT fail. Do not request them.

AVAILABLE_LOCAL_MCP_TOOLS:
${toolJson}

Reply exactly LOCAL_CODEX_READY.`
  }

  private parseToolCalls(text: string):
    | { kind: 'none' }
    | { kind: 'valid'; calls: McpToolCall[] }
    | { kind: 'invalid'; error: string } {
    const match = text.match(
      /<<<LOCAL_CODEX_CALLS>>>\s*([\s\S]*?)\s*<<<END_LOCAL_CODEX_CALLS>>>/i
    )
    if (!match) return { kind: 'none' }
    const candidate = match[1]
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
    try {
      const parsed = McpToolCallsSchema.safeParse(JSON.parse(candidate))
      if (!parsed.success) return { kind: 'invalid', error: z.prettifyError(parsed.error) }
      return { kind: 'valid', calls: parsed.data.calls }
    } catch (error) {
      return { kind: 'invalid', error: errorText(error) }
    }
  }

  private async handleAssistantResponse(text: string): Promise<void> {
    const parsed = this.parseToolCalls(text)
    if (parsed.kind === 'none') return

    if (parsed.kind === 'invalid') {
      const message = `工具调用格式无效：${parsed.error}`
      log.error(message)
      this.updateStatus(message, 'error')
      return
    }

    this.updateStatus(`正在执行 ${parsed.calls.length} 个本地工具…`, 'warn')
    const results: McpToolExecution[] = []
    for (const call of parsed.calls) {
      const cached = this.completedCalls.get(call.id)
      if (cached) {
        results.push(cached)
        continue
      }
      const result = await this.localMcpGet().call(call)
      this.completedCalls.set(call.id, result)
      results.push(result)
    }

    const payload = protocolJson({ results }, 2)
    const page = this.page
    if (!page) throw new Error('ChatGPT page was closed before tool results could be returned')
    await page.send(`<<<LOCAL_CODEX_RESULTS>>>\n${payload}\n<<<END_LOCAL_CODEX_RESULTS>>>\nContinue the task using these real results. Do not repeat completed call ids.`)
    const failed = results.filter((item) => !item.ok).length
    this.updateStatus(
      failed
        ? `工具完成：${results.length - failed} 成功，${failed} 失败`
        : `工具完成：${results.length} 个成功`,
      failed ? 'error' : 'ok'
    )
  }

}
