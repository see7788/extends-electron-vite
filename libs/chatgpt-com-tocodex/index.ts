import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
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
import PQueue from 'p-queue'
import { z } from 'zod'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import ElectronLifecycle from './ElectronLifecycle'

/**
 * Local Codex Bridge — single-file Electron main process.
 *
 * Required packages:
 *   npm i @modelcontextprotocol/sdk@1.29.0 @kudoai/chatgpt.js@4.15.1 \
 *     zod@4.4.3 p-queue@9.3.1 electron-log@5.4.4 electron-store@11.0.2
 *
 * MCP-Gateway defaults:
 *   listen: 127.0.0.1:8765
 *   server: __builtin_skills__
 *
 */

const APP_VERSION = '1.0.0'
const CHATGPT_URL = 'https://chatgpt.com/'
const POLL_MS = 900
const RECONNECT_MS = 5_000
const RESPONSE_STABLE_POLLS = 2
const MAX_RESULT_CHARS = 80_000
const MAX_BOOTSTRAP_CHARS = 120_000
const MAX_CALLS_PER_TURN = 8
const TOOL_TIMEOUT_MS = 10 * 60_000
const MCP_GATEWAY_URL = 'http://127.0.0.1:8765'
const MCP_SERVERS = ['__builtin_skills__']
const WORKSPACE_ROOT = resolve(process.cwd())

const ToolCallSchema = z.object({
  id: z.string().min(1).max(160),
  name: z.string().min(1).max(240),
  arguments: z.record(z.string(), z.unknown()).default({})
})

const ToolCallsSchema = z.object({
  calls: z.array(ToolCallSchema).min(1).max(MAX_CALLS_PER_TURN)
})

type ToolCall = z.infer<typeof ToolCallSchema>

type PersistedSettings = {
  workspaceRoot: string
}

type PageSnapshot = {
  href: string
  assistantCount: number
  userCount: number
  text: string
  streaming: boolean
  ready: boolean
  draft: string
}

type McpTool = {
  publicName: string
  originalName: string
  serverId: string
  description: string
  inputSchema: Record<string, unknown>
  client: Client
}

type McpConnection = {
  serverId: string
  endpoint: URL
  client: Client
  transport: StreamableHTTPClientTransport
  tools: McpTool[]
}

type ToolExecution = {
  id: string
  name: string
  ok: boolean
  result?: unknown
  error?: string
}

type StatusTone = 'ok' | 'warn' | 'error'

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

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max)}\n...[truncated ${text.length - max} characters by Local Codex Bridge]`
}

function errorText(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`
  return String(error)
}

function shortHash(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 20)
}

function serverAlias(server: string, index: number): string {
  const raw = server.startsWith('http')
    ? new URL(server).pathname.split('/').filter(Boolean).at(-1) || `server_${index + 1}`
    : server
  const cleaned = raw.replace(/^_+|_+$/g, '').replace(/[^a-zA-Z0-9_-]+/g, '_')
  return cleaned || `server_${index + 1}`
}

function endpointFor(baseUrl: string, server: string): URL {
  if (/^https?:\/\//i.test(server)) return new URL(server)
  return new URL(`/api/v2/mcp/${encodeURIComponent(server)}`, `${baseUrl.replace(/\/$/, '')}/`)
}

class McpGatewayPool {
  private readonly queue = new PQueue({ concurrency: 1 })
  private readonly connections = new Map<string, McpConnection>()
  private readonly tools = new Map<string, McpTool>()
  private readonly statusListeners = new Set<(message: string, tone: StatusTone) => void>()
  private connecting: Promise<void> | undefined
  private reconnectTimer: NodeJS.Timeout | undefined
  private disposed = false
  private status = 'MCP 等待连接…'
  private statusTone: StatusTone = 'warn'

  constructor(
    private readonly baseUrl: string,
    private readonly servers: string[]
  ) {}

  get toolCount(): number {
    return this.tools.size
  }

  statusSubscribe(listener: (message: string, tone: StatusTone) => void): () => void {
    this.statusListeners.add(listener)
    listener(this.status, this.statusTone)
    return () => this.statusListeners.delete(listener)
  }

  promptTools(): Array<{
    name: string
    description: string
    input_schema: Record<string, unknown>
  }> {
    return [...this.tools.values()].map((tool) => ({
      name: tool.publicName,
      description: truncate(tool.description || 'No description supplied by MCP server.', 2_000),
      input_schema: tool.inputSchema
    }))
  }

  async connect(): Promise<void> {
    if (this.disposed) return
    if (this.connecting) return this.connecting
    this.connecting = this.connectInternal().finally(() => {
      this.connecting = undefined
    })
    return this.connecting
  }

  private async connectInternal(): Promise<void> {
    await this.closeConnections()
    this.statusSet('正在连接本机 MCP-Gateway…', 'warn')

    const outcomes = await Promise.allSettled(
      this.servers.map(async (server, index) => {
        const serverId = serverAlias(server, index)
        const endpoint = endpointFor(this.baseUrl, server)
        const client = new Client(
          { name: 'electron-local-codex', version: APP_VERSION },
          { capabilities: {} }
        )
        const transport = new StreamableHTTPClientTransport(endpoint, {
          reconnectionOptions: {
            initialReconnectionDelay: 1_000,
            maxReconnectionDelay: 20_000,
            reconnectionDelayGrowFactor: 1.7,
            maxRetries: 5
          }
        })

        client.onerror = (error) => log.error(`[MCP:${serverId}]`, error)
        client.onclose = () => {
          if (this.disposed) return
          log.warn(`[MCP:${serverId}] connection closed`)
          this.dropConnection(serverId)
          this.scheduleReconnect()
        }

        await client.connect(transport)
        const listed = await client.listTools(undefined, { timeout: 30_000 })
        const tools: McpTool[] = listed.tools
          .map((tool) => {
            const publicName = `${serverId}__${tool.name}`
            return {
              publicName,
              originalName: tool.name,
              serverId,
              description: tool.description || '',
              inputSchema: tool.inputSchema as Record<string, unknown>,
              client
            }
          })

        const connection: McpConnection = { serverId, endpoint, client, transport, tools }
        this.connections.set(serverId, connection)
        for (const tool of tools) this.tools.set(tool.publicName, tool)
        log.info(`[MCP:${serverId}] connected to ${endpoint}; ${tools.length} tools`)
      })
    )

    outcomes.forEach((outcome, index) => {
      if (outcome.status === 'rejected') {
        log.error(`[MCP:${serverAlias(this.servers[index], index)}] connect failed`, outcome.reason)
      }
    })

    if (this.tools.size === 0) {
      this.statusSet('MCP 未连接；请启动 Gateway，程序会自动重试', 'error')
      this.scheduleReconnect()
      return
    }

    this.statusSet(`MCP 已连接：${this.tools.size} 个工具`, 'ok')
    if (outcomes.some((item) => item.status === 'rejected')) this.scheduleReconnect()
  }

  private statusSet(message: string, tone: StatusTone): void {
    this.status = message
    this.statusTone = tone
    for (const listener of this.statusListeners) listener(message, tone)
  }

  private dropConnection(serverId: string): void {
    const connection = this.connections.get(serverId)
    if (!connection) return
    for (const tool of connection.tools) this.tools.delete(tool.publicName)
    this.connections.delete(serverId)
  }

  private scheduleReconnect(): void {
    if (this.disposed || this.reconnectTimer) return
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined
      void this.connect().catch((error) => {
        log.error('MCP reconnect failed', error)
        this.scheduleReconnect()
      })
    }, RECONNECT_MS)
  }

  async reconnect(): Promise<void> {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.reconnectTimer = undefined
    await this.connect()
  }

  async call(call: ToolCall): Promise<ToolExecution> {
    return this.queue.add(async () => {
      const tool = this.tools.get(call.name)
      if (!tool) {
        return {
          id: call.id,
          name: call.name,
          ok: false,
          error: `Unknown or disabled tool: ${call.name}`
        }
      }

      try {
        log.info(`[TOOL:${call.id}] ${call.name}`, call.arguments)
        const raw = await tool.client.callTool(
          { name: tool.originalName, arguments: call.arguments },
          undefined,
          {
            timeout: TOOL_TIMEOUT_MS,
            resetTimeoutOnProgress: true,
            maxTotalTimeout: TOOL_TIMEOUT_MS
          }
        )
        const normalized = this.normalizeResult(raw)
        log.info(`[TOOL:${call.id}] completed`)
        return { id: call.id, name: call.name, ok: true, result: normalized }
      } catch (error) {
        log.error(`[TOOL:${call.id}] failed`, error)
        return { id: call.id, name: call.name, ok: false, error: errorText(error) }
      }
    }) as Promise<ToolExecution>
  }

  private normalizeResult(raw: unknown): unknown {
    if (!raw || typeof raw !== 'object') return raw
    const value = raw as {
      content?: Array<Record<string, unknown>>
      structuredContent?: unknown
      toolResult?: unknown
      isError?: boolean
    }
    const content = (value.content || []).map((item) => {
      if (item.type === 'text') return { type: 'text', text: item.text }
      if (item.type === 'resource') return { type: 'resource', resource: item.resource }
      if (item.type === 'resource_link') {
        return { type: 'resource_link', name: item.name, uri: item.uri, description: item.description }
      }
      if (item.type === 'image' || item.type === 'audio') {
        return { type: item.type, mimeType: item.mimeType, note: 'binary payload omitted from text bridge' }
      }
      return item
    })
    return {
      isError: value.isError || false,
      content,
      structuredContent: value.structuredContent,
      toolResult: value.toolResult
    }
  }

  private async closeConnections(): Promise<void> {
    const current = [...this.connections.values()]
    this.connections.clear()
    this.tools.clear()
    for (const connection of current) connection.client.onclose = undefined
    await Promise.allSettled(current.map((connection) => connection.client.close()))
  }

  async close(): Promise<void> {
    this.disposed = true
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.reconnectTimer = undefined
    this.queue.clear()
    await this.closeConnections()
  }
}

class ChatGptPage {
  private readonly librarySource: string
  private installed = false

  constructor(private readonly window: BrowserWindow) {
    const require = createRequire(import.meta.url)
    this.librarySource = readFileSync(require.resolve('@kudoai/chatgpt.js'), 'utf8')
  }

  async install(): Promise<boolean> {
    if (this.window.isDestroyed() || this.window.webContents.isDestroyed()) return false
    if (this.installed) return true
    try {
      this.installed = await this.window.webContents.executeJavaScript(
        `(() => {
          if (!location.hostname.endsWith('chatgpt.com')) return false;
          if (!window.chatgpt) {
            ${this.librarySource}
          }
          if (!document.getElementById('local-codex-status')) {
            const badge = document.createElement('div');
            badge.id = 'local-codex-status';
            badge.style.cssText = [
              'position:fixed', 'right:14px', 'bottom:14px', 'z-index:2147483647',
              'max-width:420px', 'padding:8px 11px', 'border-radius:9px',
              'font:12px/1.35 system-ui,sans-serif', 'color:white',
              'background:#6b7280', 'box-shadow:0 4px 18px rgba(0,0,0,.25)',
              'pointer-events:none', 'white-space:pre-wrap'
            ].join(';');
            badge.textContent = 'Local Codex 正在启动…';
            document.documentElement.appendChild(badge);
          }
          return Boolean(window.chatgpt);
        })()`,
        true
      )
      return this.installed
    } catch (error) {
      log.warn('ChatGPT page adapter installation failed', error)
      return false
    }
  }

  reset(): void {
    this.installed = false
  }

  async setStatus(message: string, tone: 'ok' | 'warn' | 'error' = 'warn'): Promise<void> {
    if (this.window.isDestroyed() || this.window.webContents.isDestroyed()) return
    const color = tone === 'ok' ? '#166534' : tone === 'error' ? '#991b1b' : '#92400e'
    try {
      await this.window.webContents.executeJavaScript(
        `(() => {
          const badge = document.getElementById('local-codex-status');
          if (!badge) return false;
          badge.textContent = ${JSON.stringify(message)};
          badge.style.background = ${JSON.stringify(color)};
          return true;
        })()`,
        true
      )
    } catch {
      // Navigation can destroy the execution context; dom-ready installs it again.
    }
  }

  async snapshot(): Promise<PageSnapshot> {
    if (this.window.isDestroyed() || this.window.webContents.isDestroyed()) {
      return {
        href: '', assistantCount: 0, userCount: 0, text: '', streaming: false, ready: false, draft: ''
      }
    }
    return this.window.webContents.executeJavaScript(
      `(() => {
        const assistants = [...document.querySelectorAll('[data-message-author-role="assistant"]')];
        const users = document.querySelectorAll('[data-message-author-role="user"]');
        const last = assistants.at(-1);
        const input = document.querySelector('#prompt-textarea, [data-testid="prompt-textarea"], textarea');
        return {
          href: location.href,
          assistantCount: assistants.length,
          userCount: users.length,
          text: last ? (last.innerText || last.textContent || '') : '',
          streaming: Boolean(document.querySelector('[data-testid="stop-button"], button[aria-label*="Stop"], button[aria-label*="停止"]')),
          ready: Boolean(input && window.chatgpt),
          draft: input ? (input.innerText || input.value || '') : ''
        };
      })()`,
      true
    ) as Promise<PageSnapshot>
  }

  async send(message: string): Promise<void> {
    const result = (await this.window.webContents.executeJavaScript(
      `(() => {
        if (!window.chatgpt) return { ok: false, reason: 'chatgpt.js not installed' };
        const input = window.chatgpt.getChatBox?.();
        if (!input) return { ok: false, reason: 'ChatGPT prompt input not found' };
        window.chatgpt.send(${JSON.stringify(message)});
        return { ok: true };
      })()`,
      true
    )) as { ok: boolean; reason?: string }
    if (!result.ok) throw new Error(result.reason || 'Unable to submit ChatGPT prompt')
  }
}

class LocalCodexWindow {
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
  private readonly completedCalls = new Map<string, ToolExecution>()
  private status = '正在启动…'
  private statusTone: StatusTone = 'warn'
  private readonly windowId = Symbol('local-codex-window')
  private readonly gatewayReady: Promise<void>
  private gateway: McpGatewayPool | undefined
  private lifecycleClosePromise: Promise<void> | undefined

  constructor(private readonly electronLifecycle: ElectronLifecycle<McpGatewayPool>) {
    this.gatewayReady = electronLifecycle.windowOpen(this.windowId).then((gateway) => {
      this.gateway = gateway
    })
  }

  async start(): Promise<void> {
    try {
      await this.gatewayReady
      const window = this.createWindow()
      this.statusUnsubscribe = this.gatewayGet().statusSubscribe((message, tone) => {
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

  private gatewayGet(): McpGatewayPool {
    if (this.gateway === undefined) {
      throw new Error('MCP gateway is unavailable after Local Codex window startup')
    }
    return this.gateway
  }

  private lifecycleClose(): Promise<void> {
    if (this.lifecycleClosePromise === undefined) {
      this.lifecycleClosePromise = this.electronLifecycle.windowClose(this.windowId)
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
            click: () => void this.gatewayGet().reconnect()
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

  private updateStatus(message: string, tone: StatusTone = 'warn'): void {
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

      if (this.gatewayGet().toolCount > 0 && this.bootstrappedConversation !== this.activeConversation) {
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
    if (!this.page || this.gatewayGet().toolCount === 0) {
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
    this.updateStatus(`正在初始化：${this.gatewayGet().toolCount} 个本地工具…`, 'warn')
    await this.page.send(prompt)
    this.bootstrapSentAt = Date.now()
    this.activeConversation = this.conversationKey(snapshot.href)
    this.bootstrappedConversation = this.activeConversation
    this.updateStatus(`Local Codex 已启用 · ${this.gatewayGet().toolCount} 个工具 · ${basename(this.workspaceRoot)}`, 'ok')
  }

  private buildBootstrapPrompt(): string {
    const allTools = this.gatewayGet().promptTools()
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
    | { kind: 'valid'; calls: ToolCall[] }
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
      const parsed = ToolCallsSchema.safeParse(JSON.parse(candidate))
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
      await this.page.send(`<<<LOCAL_CODEX_PROTOCOL_ERROR>>>\n${truncate(parsed.error, 4_000)}\n<<<END_LOCAL_CODEX_PROTOCOL_ERROR>>>\nReturn a corrected LOCAL_CODEX_CALLS block only.`)
      return
    }

    this.updateStatus(`正在执行 ${parsed.calls.length} 个本地工具…`, 'warn')
    const results: ToolExecution[] = []
    for (const call of parsed.calls) {
      const cached = this.completedCalls.get(call.id)
      if (cached) {
        results.push(cached)
        continue
      }
      const result = await this.gatewayGet().call(call)
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

  private boundedResultPayload(results: ToolExecution[]): string {
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
          : { truncated: true, text: truncate(serialized, perResult) }
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

let electronLifecycle: ElectronLifecycle<McpGatewayPool> | undefined

export default async function localCodexWindowCreate(): Promise<LocalCodexWindow> {
  if (electronLifecycle === undefined) {
    electronLifecycle = new ElectronLifecycle(
      () => new McpGatewayPool(MCP_GATEWAY_URL, MCP_SERVERS)
    )
  }
  const localCodexWindow = new LocalCodexWindow(electronLifecycle)
  await localCodexWindow.start()
  return localCodexWindow
}
