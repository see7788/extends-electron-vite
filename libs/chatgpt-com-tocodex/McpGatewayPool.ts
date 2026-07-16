import log from 'electron-log/main'
import PQueue from 'p-queue'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import {
  bridgeErrorText,
  bridgeTextTruncate,
  type BridgeStatusTone
} from './LocalCodexBridge'

const APP_VERSION = '1.0.0'
const RECONNECT_MS = 5_000
const TOOL_TIMEOUT_MS = 10 * 60_000

export type McpToolCall = {
  id: string
  name: string
  arguments: Record<string, unknown>
}

export type McpToolExecution = {
  id: string
  name: string
  ok: boolean
  result?: unknown
  error?: string
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

export default class McpGatewayPool {
  private readonly queue = new PQueue({ concurrency: 1 })
  private readonly connections = new Map<string, McpConnection>()
  private readonly tools = new Map<string, McpTool>()
  private readonly statusListeners = new Set<(message: string, tone: BridgeStatusTone) => void>()
  private connecting: Promise<void> | undefined
  private reconnectTimer: NodeJS.Timeout | undefined
  private disposed = false
  private status = 'MCP 等待连接…'
  private statusTone: BridgeStatusTone = 'warn'

  constructor(
    private readonly baseUrl: string,
    private readonly servers: string[]
  ) {}

  get toolCount(): number {
    return this.tools.size
  }

  statusSubscribe(listener: (message: string, tone: BridgeStatusTone) => void): () => void {
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
      description: bridgeTextTruncate(tool.description || 'No description supplied by MCP server.', 2_000),
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
        const tools: McpTool[] = listed.tools.map((tool) => {
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

  private statusSet(message: string, tone: BridgeStatusTone): void {
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

  async call(call: McpToolCall): Promise<McpToolExecution> {
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
        return { id: call.id, name: call.name, ok: false, error: bridgeErrorText(error) }
      }
    }) as Promise<McpToolExecution>
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
