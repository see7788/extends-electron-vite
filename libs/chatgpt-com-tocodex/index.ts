import { app } from 'electron/main'
import log from 'electron-log/main'
import PQueue from 'p-queue'
import LocalCodexWindowBase from './LocalCodexWindow'
import McpGatewayPool from './McpGatewayPool'

const MCP_GATEWAY_URL = 'http://127.0.0.1:8765'
const MCP_SERVERS = ['__builtin_skills__']

export default class LocalCodexWindow extends LocalCodexWindowBase {
  private static readonly windowIds = new Set<symbol>()
  private static readonly electronLifecycleQueue = new PQueue({ concurrency: 1 })
  private static electronLifecycleStarted = false
  private static electronApplicationClosing = false
  private static mcpGatewayPool: McpGatewayPool | undefined

  constructor() {
    const windowId = Symbol('local-codex-window')
    super(
      LocalCodexWindow.windowOpen(windowId),
      () => LocalCodexWindow.windowClose(windowId)
    )
    void this.start()
  }

  private static async windowOpen(windowId: symbol): Promise<McpGatewayPool> {
    await app.whenReady()
    LocalCodexWindow.electronLifecycleStart()
    return LocalCodexWindow.electronLifecycleQueue.add(async () => {
      if (LocalCodexWindow.electronApplicationClosing) {
        throw new Error('Electron application is closing; cannot create a Local Codex window')
      }
      if (LocalCodexWindow.windowIds.has(windowId)) {
        throw new Error('Local Codex window lifecycle was opened twice')
      }

      LocalCodexWindow.windowIds.add(windowId)
      if (LocalCodexWindow.windowIds.size !== 1) return LocalCodexWindow.mcpGatewayGet()
      if (LocalCodexWindow.mcpGatewayPool !== undefined) {
        throw new Error('MCP gateway exists without any Local Codex windows')
      }

      const mcpGatewayPool = new McpGatewayPool(MCP_GATEWAY_URL, MCP_SERVERS)
      LocalCodexWindow.mcpGatewayPool = mcpGatewayPool
      await mcpGatewayPool.connect()
      return mcpGatewayPool
    })
  }

  private static electronLifecycleStart(): void {
    if (LocalCodexWindow.electronLifecycleStarted) return

    LocalCodexWindow.electronLifecycleStarted = true
    log.initialize()
    log.transports.file.level = 'info'
    log.transports.console.level = 'info'
    app.setAppUserModelId('com.local-codex.electron')
    app.once('before-quit', (event) => {
      if (LocalCodexWindow.electronApplicationClosing) return

      event.preventDefault()
      LocalCodexWindow.electronApplicationClosing = true
      void LocalCodexWindow.applicationClose().then(() => app.quit())
    })
  }

  private static windowClose(windowId: symbol): Promise<void> {
    return LocalCodexWindow.electronLifecycleQueue.add(async () => {
      if (LocalCodexWindow.electronApplicationClosing) return
      if (!LocalCodexWindow.windowIds.delete(windowId)) {
        throw new Error('Local Codex window lifecycle was closed before it opened')
      }
      if (LocalCodexWindow.windowIds.size !== 0) return

      await LocalCodexWindow.mcpGatewayClose()
    })
  }

  private static async mcpGatewayClose(): Promise<void> {
    const mcpGatewayPool = LocalCodexWindow.mcpGatewayGet()
    await mcpGatewayPool.close()
    LocalCodexWindow.mcpGatewayPool = undefined
  }

  private static mcpGatewayGet(): McpGatewayPool {
    if (LocalCodexWindow.mcpGatewayPool === undefined) {
      throw new Error('MCP gateway is not available for an active Local Codex window')
    }
    return LocalCodexWindow.mcpGatewayPool
  }

  private static applicationClose(): Promise<void> {
    return LocalCodexWindow.electronLifecycleQueue.add(async () => {
      LocalCodexWindow.windowIds.clear()
      if (LocalCodexWindow.mcpGatewayPool === undefined) return

      await LocalCodexWindow.mcpGatewayClose()
    })
  }
}
