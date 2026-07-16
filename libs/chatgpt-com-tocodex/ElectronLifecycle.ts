import { app } from 'electron'
import log from 'electron-log/main'
import PQueue from 'p-queue'
import McpGatewayPool from './McpGatewayPool'

const MCP_GATEWAY_URL = 'http://127.0.0.1:8765'
const MCP_SERVERS = ['__builtin_skills__']

export default class ElectronLifecycle {
  private readonly windowIds = new Set<symbol>()
  private readonly windowQueue = new PQueue({ concurrency: 1 })
  private gateway: McpGatewayPool | undefined
  private applicationClosing = false

  constructor() {
    log.initialize()
    log.transports.file.level = 'info'
    log.transports.console.level = 'info'
    app.setAppUserModelId('com.local-codex.electron')
    app.once('before-quit', (event) => {
      if (this.applicationClosing) return
      event.preventDefault()
      this.applicationClosing = true
      void this.applicationClose().then(() => app.quit())
    })
  }

  windowOpen(windowId: symbol): Promise<McpGatewayPool> {
    return this.windowQueue.add(async () => {
      if (this.applicationClosing) {
        throw new Error('Electron application is closing; cannot open a Local Codex window')
      }
      if (this.windowIds.has(windowId)) {
        throw new Error('Local Codex window lifecycle was opened twice')
      }

      this.windowIds.add(windowId)
      if (this.windowIds.size !== 1) return this.gatewayGet()
      if (this.gateway !== undefined) {
        throw new Error('MCP gateway exists without any Local Codex windows')
      }

      const gateway = new McpGatewayPool(MCP_GATEWAY_URL, MCP_SERVERS)
      this.gateway = gateway
      await gateway.connect()
      return gateway
    }) as Promise<McpGatewayPool>
  }

  windowClose(windowId: symbol): Promise<void> {
    return this.windowQueue.add(async () => {
      if (this.applicationClosing) return
      if (!this.windowIds.delete(windowId)) {
        throw new Error('Local Codex window lifecycle was closed before it opened')
      }
      if (this.windowIds.size !== 0) return

      const gateway = this.gatewayGet()
      await gateway.close()
      this.gateway = undefined
    }) as Promise<void>
  }

  private async applicationClose(): Promise<void> {
    await (this.windowQueue.add(async () => {
      this.windowIds.clear()
      if (this.gateway === undefined) return
      await this.gateway.close()
      this.gateway = undefined
    }) as Promise<void>)
  }

  private gatewayGet(): McpGatewayPool {
    if (this.gateway === undefined) {
      throw new Error('MCP gateway is not available for an active Local Codex window')
    }
    return this.gateway
  }
}
