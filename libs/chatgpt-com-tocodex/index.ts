import { app } from 'electron/main'
import log from 'electron-log/main'
import PQueue from 'p-queue'
import LocalCodexWindow from './LocalCodexWindow'
import McpGatewayPool from './McpGatewayPool'

const MCP_GATEWAY_URL = 'http://127.0.0.1:8765'
const MCP_SERVERS = ['__builtin_skills__']

const localCodexWindows = new Set<LocalCodexWindow>()
const electronLifecycleQueue = new PQueue({ concurrency: 1 })

let electronLifecycleStarted = false
let electronApplicationClosing = false
let mcpGatewayPool: McpGatewayPool | undefined

export default async function localCodexWindowCreate(): Promise<LocalCodexWindow> {
  electronLifecycleStart()
  const localCodexWindow = await electronLifecycleQueue.add(async () => {
    if (electronApplicationClosing) {
      throw new Error('Electron application is closing; cannot create a Local Codex window')
    }

    const gateway = await mcpGatewayOpen()
    const nextWindow = new LocalCodexWindow(gateway, localCodexWindowClose)
    localCodexWindows.add(nextWindow)
    return nextWindow
  })
  await localCodexWindow.start()
  return localCodexWindow
}

function electronLifecycleStart(): void {
  if (electronLifecycleStarted) return

  electronLifecycleStarted = true
  log.initialize()
  log.transports.file.level = 'info'
  log.transports.console.level = 'info'
  app.setAppUserModelId('com.local-codex.electron')
  app.once('before-quit', (event) => {
    if (electronApplicationClosing) return

    event.preventDefault()
    electronApplicationClosing = true
    void electronApplicationClose().then(() => app.quit())
  })
}

function localCodexWindowClose(localCodexWindow: LocalCodexWindow): Promise<void> {
  return electronLifecycleQueue.add(async () => {
    if (electronApplicationClosing) return
    if (!localCodexWindows.delete(localCodexWindow)) {
      throw new Error('Local Codex window lifecycle was closed before it opened')
    }
    if (localCodexWindows.size !== 0) return

    await mcpGatewayClose()
  })
}

async function mcpGatewayOpen(): Promise<McpGatewayPool> {
  if (mcpGatewayPool !== undefined) return mcpGatewayPool

  const gateway = new McpGatewayPool(MCP_GATEWAY_URL, MCP_SERVERS)
  await gateway.connect()
  mcpGatewayPool = gateway
  return gateway
}

async function mcpGatewayClose(): Promise<void> {
  if (mcpGatewayPool === undefined) return

  await mcpGatewayPool.close()
  mcpGatewayPool = undefined
}

function electronApplicationClose(): Promise<void> {
  return electronLifecycleQueue.add(async () => {
    localCodexWindows.clear()
    await mcpGatewayClose()
  })
}
