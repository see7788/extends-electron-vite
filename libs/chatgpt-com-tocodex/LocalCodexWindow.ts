import { createHash } from 'node:crypto'
import { basename, resolve } from 'node:path'
import {
  BrowserWindow,
  dialog,
  Menu,
  session,
  type MenuItemConstructorOptions
} from 'electron'
import log from 'electron-log/main'
import Store from 'electron-store'
import { z } from 'zod'
import ChatGptPage, { type PageSnapshot } from './ChatGptPage'
import McpGatewayPool, {
  type McpStatusTone,
  type McpToolCall,
  type McpToolExecution
} from './McpGatewayPool'

const CHATGPT_URL = 'https://chatgpt.com/'
const POLL_MS = 900
const RESPONSE_STABLE_POLLS = 2
const MAX_RESULT_CHARS = 80_000
const MAX_BOOTSTRAP_CHARS = 120_000
const MAX_CALLS_PER_TURN = 8
const WORKSPACE_ROOT = resolve(process.cwd())

const McpToolCallSchema = z.object({
  id: z.string().min(1).max(160),
  name: z.string().min(1).max(240),
  arguments: z.record(z.string(), z.unknown()).default({})
})

const McpToolCallsSchema = z.object({
  calls: z.array(McpToolCallSchema).min(1).max(MAX_CALLS_PER_TURN)
})

type PersistedSettings = {
  workspaceRoot: string
}

function safeJson(value: unknown, space = 0): string {
  const seen = new WeakSet<object>()
  return JSON.stringify(
    value,
    (_key, item: unknown) => {
      if (typeof item === 'bigint') return item.toString()
      if (typeof item === 'object' && item !== null) {
        if (seen.has(item)) return '[Circular]'
        seen.add(item)
      }
      return item
    },
    space
  )
}

function shortHash(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 20)
}

function errorText(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`
  return String(error)
}

function textTruncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max)}\n...[truncated ${text.length - max} characters by Local Codex]`
}

export default class LocalCodexWindow {
  private window: BrowserWindow | undefined
  private page: ChatGptPage | undefined
  private readonly store = new Store<PersistedSettings>({
    name: 'local-codex-bridge',
    defaults: { workspaceRoot: WORKSPACE_ROOT }
  })
  private monitorTimer: NodeJS.Timeout | undefined
  private statusUnsubscribe: (() => void) | undefined
  private monitorBusy = false
  private activeConversation = ''
  private bootstrappedConversation = ''
  private bootstrapSentAt = 0
  private candidateResponse = ''
  private candidatePolls = 0
  private readonly processedResponses = new Set<string>()
  private readonly completedCalls = new Map<string, McpToolExecution>()
  private status = '正在启动…'
  private statusTone: McpStatusTone = 'warn'
  private mcpGateway: McpGatewayPool | undefined
  private lifecycleClosePromise: Promise<void> | undefined

  constructor(
    private readonly gatewayReady: Promise<McpGatewayPool>,
    private readonly windowClose: () => Promise<void>
  ) {}

  protected async start(): Promise<void> {
    try {
      this.mcpGateway = await this.gatewayReady
      const window = this.createWindow()
      this.statusUnsubscribe = this.mcpGatewayGet().statusSubscribe((message, tone) => {
        this.updateStatus(message, tone)
      })
      this.installMenu()
      await window.loadURL(CHATGPT_URL)
      this.startMonitor()
    } catch (error) {
      this.window?.destroy()
      await this.lifecycleClose()
      throw error
    }
  }

  private mcpGatewayGet(): McpGatewayPool {
    if (this.mcpGateway === undefined) {
      throw new Error('MCP gateway is unavailable after Local Codex window startup')
    }
    return this.mcpGateway
  }

  private lifecycleClose(): Promise<void> {
    if (this.lifecycleClosePromise === undefined) {
      this.lifecycleClosePromise = this.windowClose()
    }
    return this.lifecycleClosePromise
  }

  private createWindow(): BrowserWindow {
    this.window = new BrowserWindow({
      width: 1280,
      height: 860,
      minWidth: 900,
      minHeight: 640,
      show: false,
      autoHideMenuBar: false,
      title: 'Local Codex — ChatGPT',
      webPreferences: {
        partition: 'persist:local-codex-chatgpt',
        contextIsolation: true,
        sandbox: true,
        nodeIntegration: false,
        webSecurity: true
      }
    })
    this.page = new ChatGptPage(this.window)

    const ses = session.fromPartition('persist:local-codex-chatgpt')
    ses.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false))

    this.window.once('ready-to-show', () => this.window?.show())
    this.window.webContents.on('dom-ready', () => {
      this.page?.reset()
      void this.page?.install().then(() => this.page?.setStatus(this.status, this.statusTone))
    })
    this.window.webContents.on('did-navigate-in-page', (_event, url) => this.onNavigation(url))
    this.window.webContents.on('did-navigate', (_event, url) => this.onNavigation(url))
    this.window.webContents.on('render-process-gone', (_event, details) => {
      log.error('ChatGPT renderer process gone', details)
    })
    this.window.on('closed', () => {
      this.window = undefined
      this.page = undefined
      if (this.monitorTimer) clearInterval(this.monitorTimer)
      this.monitorTimer = undefined
      this.statusUnsubscribe?.()
      this.statusUnsubscribe = undefined
      void this.lifecycleClose()
    })
    return this.window
  }

  private installMenu(): void {
    const template: MenuItemConstructorOptions[] = []
    if (process.platform === 'darwin') template.push({ role: 'appMenu' })
    template.push(
      {
        label: '本地 Codex',
        submenu: [
          {
            label: '初始化当前对话',
            accelerator: 'CmdOrCtrl+Shift+L',
            click: () => {
              this.bootstrappedConversation = ''
              void this.bootstrapCurrentConversation(true)
            }
          },
          {
            label: '选择工作区…',
            accelerator: 'CmdOrCtrl+Shift+O',
            click: () => void this.chooseWorkspace()
          },
          {
            label: '重新连接 MCP',
            accelerator: 'CmdOrCtrl+Shift+M',
            click: () => void this.mcpGatewayGet().reconnect()
          },
          { type: 'separator' },
          {
            label: '打开开发者工具',
            accelerator: 'CmdOrCtrl+Alt+I',
            click: () => this.window?.webContents.toggleDevTools()
          },
          { role: 'reload' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      { role: 'editMenu' },
      { role: 'viewMenu' }
    )
    this.window?.setMenu(Menu.buildFromTemplate(template))
  }

  private async chooseWorkspace(): Promise<void> {
    if (!this.window) return
    const selection = await dialog.showOpenDialog(this.window, {
      title: '选择 Local Codex 工作区',
      defaultPath: this.workspaceRoot,
      properties: ['openDirectory', 'createDirectory']
    })
    const selected = selection.filePaths[0]
    if (selection.canceled || !selected) return
    this.store.set('workspaceRoot', resolve(selected))
    this.bootstrappedConversation = ''
    this.updateStatus(`工作区：${this.workspaceRoot}`, 'ok')
    await this.bootstrapCurrentConversation(true)
  }

  private get workspaceRoot(): string {
    return this.store.get('workspaceRoot')
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
    this.candidateResponse = ''
    this.candidatePolls = 0
    if (promotedNewChat) this.bootstrappedConversation = next
    else {
      this.bootstrappedConversation = ''
      this.completedCalls.clear()
    }
  }

  private conversationKey(url: string): string {
    try {
      const parsed = new URL(url)
      const match = parsed.pathname.match(/^\/c\/([^/]+)/)
      return match ? `chat:${match[1]}` : parsed.pathname === '/' ? 'new' : `page:${parsed.pathname}`
    } catch {
      return 'unknown'
    }
  }

  private updateStatus(message: string, tone: McpStatusTone = 'warn'): void {
    this.status = message
    this.statusTone = tone
    void this.page?.setStatus(message, tone)
  }

  private startMonitor(): void {
    this.monitorTimer = setInterval(() => void this.monitorTick(), POLL_MS)
  }

  private async monitorTick(): Promise<void> {
    if (this.monitorBusy || !this.page) return
    this.monitorBusy = true
    try {
      await this.page.install()
      const snapshot = await this.page.snapshot()
      if (!snapshot.ready) {
        this.updateStatus('请先登录 ChatGPT；登录后将自动启用 Local Codex', 'warn')
        return
      }

      const conversation = this.conversationKey(snapshot.href)
      if (conversation !== this.activeConversation) this.onNavigation(snapshot.href)

      if (this.mcpGatewayGet().toolCount > 0 && this.bootstrappedConversation !== this.activeConversation) {
        await this.bootstrapCurrentConversation(false)
        return
      }

      if (snapshot.streaming || !snapshot.text.trim()) {
        this.candidateResponse = ''
        this.candidatePolls = 0
        return
      }

      const responseId = `${conversation}:${snapshot.assistantCount}:${shortHash(snapshot.text)}`
      if (responseId !== this.candidateResponse) {
        this.candidateResponse = responseId
        this.candidatePolls = 1
        return
      }

      this.candidatePolls += 1
      if (this.candidatePolls < RESPONSE_STABLE_POLLS || this.processedResponses.has(responseId)) return
      this.processedResponses.add(responseId)
      this.trimCaches()
      await this.handleAssistantResponse(snapshot.text)
    } catch (error) {
      log.warn('Monitor tick failed', error)
    } finally {
      this.monitorBusy = false
    }
  }

  private async bootstrapCurrentConversation(force: boolean): Promise<void> {
    if (!this.page || this.mcpGatewayGet().toolCount === 0) {
      if (force) {
        await dialog.showMessageBox(this.window!, {
          type: 'warning',
          message: 'MCP-Gateway 尚未连接',
          detail: '请启动 MCP-Gateway 并启用至少一个 MCP 服务，然后选择“重新连接 MCP”。'
        })
      }
      return
    }
    const snapshot = await this.page.snapshot()
    if (!snapshot.ready) return
    if (snapshot.streaming) {
      this.updateStatus('请等待当前回复完成后再初始化 Local Codex', 'warn')
      return
    }
    if (snapshot.draft.trim()) {
      this.updateStatus('输入框中有未发送内容；请发送或清空后再初始化', 'warn')
      return
    }

    const prompt = this.buildBootstrapPrompt()
    this.updateStatus(`正在初始化：${this.mcpGatewayGet().toolCount} 个本地工具…`, 'warn')
    await this.page.send(prompt)
    this.bootstrapSentAt = Date.now()
    this.activeConversation = this.conversationKey(snapshot.href)
    this.bootstrappedConversation = this.activeConversation
    this.updateStatus(`Local Codex 已启用 · ${this.mcpGatewayGet().toolCount} 个工具 · ${basename(this.workspaceRoot)}`, 'ok')
  }

  private buildBootstrapPrompt(): string {
    const allTools = this.mcpGatewayGet().promptTools()
    const includedTools: typeof allTools = []
    for (const tool of allTools) {
      const candidate = [...includedTools, tool]
      if (safeJson(candidate).length > MAX_BOOTSTRAP_CHARS) break
      includedTools.push(tool)
    }
    const toolJson = safeJson(includedTools, 2)
    return `You are connected to a LOCAL_CODEX_BRIDGE hosted by this Electron application.

The bridge is an MCP client. It can execute the tools listed below on the user's computer through a local MCP-Gateway. You must use these tools whenever the user's request needs local files, code search, edits, commands, tests, browser automation, or other listed capabilities. Never claim that you cannot access the local project before attempting the appropriate tool.

WORKSPACE_ROOT: ${this.workspaceRoot}

PROTOCOL (mandatory):
1. To call tools, reply with exactly one block and no surrounding prose:
<<<LOCAL_CODEX_CALLS>>>
{"calls":[{"id":"unique-call-id","name":"exact_tool_name","arguments":{}}]}
<<<END_LOCAL_CODEX_CALLS>>>
2. You may request up to ${MAX_CALLS_PER_TURN} independent calls in one block. Keep dependent calls in separate turns.
3. The host replies between LOCAL_CODEX_RESULTS markers. Continue from those real results.
4. Never fabricate a tool result. Never repeat a completed call id.
5. When the task is complete, answer normally without protocol tags.
6. Keep all file operations within WORKSPACE_ROOT unless the user explicitly asks otherwise and the gateway policy permits it.

AVAILABLE_MCP_TOOLS:
${toolJson}

${includedTools.length < allTools.length ? `NOTE: ${allTools.length - includedTools.length} tools were omitted because the combined schemas exceeded the bridge prompt limit.` : ''}

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
    if (!this.page) return
    const parsed = this.parseToolCalls(text)
    if (parsed.kind === 'none') return

    if (parsed.kind === 'invalid') {
      this.updateStatus('工具调用格式无效，正在要求模型修正…', 'error')
      await this.page.send(`<<<LOCAL_CODEX_PROTOCOL_ERROR>>>\n${textTruncate(parsed.error, 4_000)}\n<<<END_LOCAL_CODEX_PROTOCOL_ERROR>>>\nReturn a corrected LOCAL_CODEX_CALLS block only.`)
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
      const result = await this.mcpGatewayGet().call(call)
      this.completedCalls.set(call.id, result)
      results.push(result)
    }

    const payload = this.boundedResultPayload(results)
    await this.page.send(`<<<LOCAL_CODEX_RESULTS>>>\n${payload}\n<<<END_LOCAL_CODEX_RESULTS>>>\nContinue the task using these real results. Do not repeat completed call ids.`)
    const failed = results.filter((item) => !item.ok).length
    this.updateStatus(
      failed
        ? `工具完成：${results.length - failed} 成功，${failed} 失败`
        : `工具完成：${results.length} 个成功`,
      failed ? 'error' : 'ok'
    )
  }

  private boundedResultPayload(results: McpToolExecution[]): string {
    const complete = safeJson({ results }, 2)
    if (complete.length <= MAX_RESULT_CHARS) return complete

    const perResult = Math.max(2_000, Math.floor(MAX_RESULT_CHARS / Math.max(1, results.length)) - 500)
    const bounded = results.map((item) => {
      if (item.result === undefined) return item
      const serialized = safeJson(item.result)
      return {
        ...item,
        result: serialized.length <= perResult
          ? item.result
          : { truncated: true, text: textTruncate(serialized, perResult) }
      }
    })
    return safeJson({ results: bounded, bridge_truncated: true }, 2)
  }

  private trimCaches(): void {
    while (this.processedResponses.size > 500) {
      const first = this.processedResponses.values().next().value as string | undefined
      if (!first) break
      this.processedResponses.delete(first)
    }
    while (this.completedCalls.size > 500) {
      const first = this.completedCalls.keys().next().value as string | undefined
      if (!first) break
      this.completedCalls.delete(first)
    }
  }
}
