import { spawn } from 'node:child_process'
import { readFile, realpath, stat } from 'node:fs/promises'
import { dirname, isAbsolute, normalize, relative, resolve, sep } from 'node:path'

export type McpStatusTone = 'ok' | 'warn' | 'error'

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

type LocalTool = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

type Workspace = {
  root: string
}

type CommandResult = {
  exitCode: number | null
  signal: NodeJS.Signals | null
  stdout: string
  stderr: string
}

const localTools: readonly LocalTool[] = [
  {
    name: 'read_file',
    description: 'Read one UTF-8 text file below the selected workspace. Paths must be relative to the workspace root.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['path'],
      properties: { path: { type: 'string', minLength: 1 } }
    }
  },
  {
    name: 'list_files',
    description: 'List files below a selected workspace directory with rg. The .git directory is excluded, while dotfiles such as .gitignore are included.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: { path: { type: 'string', minLength: 1 } }
    }
  },
  {
    name: 'search_text',
    description: 'Search text with rg below a selected workspace directory. Returns every rg JSON event without truncation.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['query'],
      properties: {
        query: { type: 'string', minLength: 1 },
        path: { type: 'string', minLength: 1 }
      }
    }
  },
  {
    name: 'apply_patch',
    description: 'Apply one unified Git patch below the selected workspace. Patch paths must be relative and may not escape the workspace.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['patch'],
      properties: { patch: { type: 'string', minLength: 1 } }
    }
  },
  {
    name: 'exec_command',
    description: 'Run one Windows PowerShell command in the selected workspace or an explicit relative working directory. The command is not given an implicit timeout and returns only after it exits.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['command'],
      properties: {
        command: { type: 'string', minLength: 1 },
        working_directory: { type: 'string', minLength: 1 }
      }
    }
  }
]

function errorText(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`
  return String(error)
}

function requireString(argumentsValue: Record<string, unknown>, name: string): string {
  const value = argumentsValue[name]
  if (typeof value !== 'string' || !value) {
    throw new TypeError(`Tool argument ${name} must be a non-empty string`)
  }
  return value
}

function optionalString(argumentsValue: Record<string, unknown>, name: string): string | undefined {
  const value = argumentsValue[name]
  if (value === undefined) return undefined
  if (typeof value !== 'string' || !value) {
    throw new TypeError(`Tool argument ${name} must be a non-empty string when supplied`)
  }
  return value
}

function isWithin(root: string, candidate: string): boolean {
  const pathRelative = relative(root, candidate)
  return pathRelative === '' || (!pathRelative.startsWith(`..${sep}`) && pathRelative !== '..' && !isAbsolute(pathRelative))
}

function relativePath(path: string): string {
  if (!path || path.includes('\0') || isAbsolute(path) || /^[a-zA-Z]:/.test(path)) {
    throw new Error('Tool paths must be non-empty workspace-relative paths')
  }
  const normalized = normalize(path)
  if (normalized === '.' || normalized === '..' || normalized.startsWith(`..${sep}`)) {
    throw new Error('Tool paths must stay below the selected workspace')
  }
  return normalized
}

async function nearestExistingAncestor(path: string): Promise<string> {
  let candidate = path
  for (;;) {
    try {
      await stat(candidate)
      return candidate
    } catch (error) {
      if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error
      const parent = dirname(candidate)
      if (parent === candidate) throw error
      candidate = parent
    }
  }
}

async function commandRun(program: string, argumentsValue: string[], cwd: string, input?: string): Promise<CommandResult> {
  return new Promise<CommandResult>((resolvePromise, rejectPromise) => {
    const child = spawn(program, argumentsValue, {
      cwd,
      shell: false,
      windowsHide: true,
      stdio: 'pipe'
    })
    let stdout = ''
    let stderr = ''
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk
    })
    child.stderr.on('data', (chunk: string) => {
      stderr += chunk
    })
    child.once('error', rejectPromise)
    child.once('close', (exitCode, signal) => {
      resolvePromise({ exitCode, signal, stdout, stderr })
    })
    child.stdin.end(input)
  })
}

export default class LocalCodexMcp {
  private readonly statusListeners = new Set<(message: string, tone: McpStatusTone) => void>()
  private readonly inFlight = new Set<Promise<McpToolExecution>>()
  private workspace: Workspace | undefined
  private closePromise: Promise<void> | undefined
  private status = '本机 Local MCP 已启动；等待选择工作区'
  private statusTone: McpStatusTone = 'warn'
  private state: 'open' | 'closing' | 'closed' = 'open'

  get toolCount(): number {
    return localTools.length
  }

  get workspaceReady(): boolean {
    return this.workspace !== undefined
  }

  statusSubscribe(listener: (message: string, tone: McpStatusTone) => void): () => void {
    this.statusListeners.add(listener)
    listener(this.status, this.statusTone)
    return () => this.statusListeners.delete(listener)
  }

  promptTools(): Array<{
    name: string
    description: string
    input_schema: Record<string, unknown>
  }> {
    return localTools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.inputSchema
    }))
  }

  async workspaceConfigure(workspaceRoot: string): Promise<void> {
    this.openRequired()
    if (this.inFlight.size > 0) {
      throw new Error('Cannot change the Local Codex workspace while tool calls are still executing')
    }
    const root = await realpath(resolve(workspaceRoot))
    const rootStat = await stat(root)
    if (!rootStat.isDirectory()) throw new Error(`Local Codex workspace is not a directory: ${root}`)
    this.workspace = { root }
    this.statusSet(`本机 Local MCP 已就绪：${this.toolCount} 个工具`, 'ok')
  }

  async call(call: McpToolCall): Promise<McpToolExecution> {
    if (this.state !== 'open') {
      return {
        id: call.id,
        name: call.name,
        ok: false,
        error: `Local Codex MCP is ${this.state}; it does not accept new tool calls`
      }
    }
    const execution = this.callExecute(call)
    this.inFlight.add(execution)
    try {
      return await execution
    } finally {
      this.inFlight.delete(execution)
    }
  }

  async close(): Promise<void> {
    if (this.closePromise === undefined) {
      this.state = 'closing'
      this.statusSet('本机 Local MCP 正在关闭；等待已接受的工具调用完成', 'warn')
      this.closePromise = Promise.all([...this.inFlight]).then(() => {
        this.state = 'closed'
        this.statusSet('本机 Local MCP 已关闭', 'warn')
      })
    }
    return this.closePromise
  }

  private async callExecute(call: McpToolCall): Promise<McpToolExecution> {
    try {
      const result = await this.toolExecute(call)
      return { id: call.id, name: call.name, ok: true, result }
    } catch (error) {
      return { id: call.id, name: call.name, ok: false, error: errorText(error) }
    }
  }

  private async toolExecute(call: McpToolCall): Promise<unknown> {
    const workspace = this.workspaceRequired()
    switch (call.name) {
      case 'read_file':
        return this.fileRead(workspace, requireString(call.arguments, 'path'))
      case 'list_files':
        return this.filesList(workspace, optionalString(call.arguments, 'path'))
      case 'search_text':
        return this.textSearch(workspace, requireString(call.arguments, 'query'), optionalString(call.arguments, 'path'))
      case 'apply_patch':
        return this.patchApply(workspace, requireString(call.arguments, 'patch'))
      case 'exec_command':
        return this.commandExecute(workspace, requireString(call.arguments, 'command'), optionalString(call.arguments, 'working_directory'))
      default:
        throw new Error(`Unknown local tool: ${call.name}`)
    }
  }

  private async fileRead(workspace: Workspace, path: string): Promise<{ path: string; content: string }> {
    const target = await this.fileResolve(workspace, path)
    const targetStat = await stat(target)
    if (!targetStat.isFile()) throw new Error(`read_file requires a file: ${path}`)
    const content = await readFile(target, 'utf8')
    if (content.includes('\0')) throw new Error(`read_file refuses binary data: ${path}`)
    return { path: this.pathDisplay(workspace, target), content }
  }

  private async filesList(workspace: Workspace, path: string | undefined): Promise<{ path: string; files: string[] }> {
    const target = path === undefined ? workspace.root : await this.directoryResolve(workspace, path)
    const result = await commandRun('rg', ['--files', '--hidden', '--glob', '!**/.git/**', '.'], target)
    if (result.exitCode !== 0 && result.exitCode !== 1) {
      throw new Error(`rg --files failed with exit code ${result.exitCode}: ${result.stderr || result.stdout}`)
    }
    return {
      path: this.pathDisplay(workspace, target),
      files: result.stdout.split(/\r?\n/).filter(Boolean)
    }
  }

  private async textSearch(workspace: Workspace, query: string, path: string | undefined): Promise<{ path: string; events: string }> {
    const target = path === undefined ? workspace.root : await this.directoryResolve(workspace, path)
    const result = await commandRun('rg', ['--json', '--hidden', '--glob', '!**/.git/**', '--', query, '.'], target)
    if (result.exitCode !== 0 && result.exitCode !== 1) {
      throw new Error(`rg search failed with exit code ${result.exitCode}: ${result.stderr || result.stdout}`)
    }
    return { path: this.pathDisplay(workspace, target), events: result.stdout }
  }

  private async patchApply(workspace: Workspace, patch: string): Promise<{ applied: true }> {
    await this.patchPathsValidate(workspace, patch)
    const checked = await commandRun('git', ['apply', '--check', '--recount', '--whitespace=nowarn', '-'], workspace.root, patch)
    if (checked.exitCode !== 0) {
      throw new Error(`git apply --check failed: ${checked.stderr || checked.stdout}`)
    }
    const applied = await commandRun('git', ['apply', '--recount', '--whitespace=nowarn', '-'], workspace.root, patch)
    if (applied.exitCode !== 0) {
      throw new Error(`git apply failed after a successful check: ${applied.stderr || applied.stdout}`)
    }
    return { applied: true }
  }

  private async commandExecute(workspace: Workspace, command: string, workingDirectory: string | undefined): Promise<CommandResult & { working_directory: string }> {
    if (process.platform !== 'win32') {
      throw new Error('exec_command supports Windows PowerShell only')
    }
    const cwd = workingDirectory === undefined ? workspace.root : await this.directoryResolve(workspace, workingDirectory)
    const result = await commandRun('powershell.exe', ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', command], cwd)
    return { ...result, working_directory: this.pathDisplay(workspace, cwd) }
  }

  private workspaceRequired(): Workspace {
    if (this.workspace === undefined) throw new Error('Select a Local Codex workspace before calling local tools')
    return this.workspace
  }

  private openRequired(): void {
    if (this.state !== 'open') throw new Error(`Local Codex MCP is ${this.state}`)
  }

  private statusSet(message: string, tone: McpStatusTone): void {
    this.status = message
    this.statusTone = tone
    for (const listener of this.statusListeners) listener(message, tone)
  }

  private async fileResolve(workspace: Workspace, path: string): Promise<string> {
    const candidate = await this.pathResolve(workspace, path)
    const canonical = await realpath(candidate)
    if (!isWithin(workspace.root, canonical)) throw new Error(`Path resolves outside the selected workspace: ${path}`)
    return canonical
  }

  private async directoryResolve(workspace: Workspace, path: string): Promise<string> {
    const candidate = await this.fileResolve(workspace, path)
    const candidateStat = await stat(candidate)
    if (!candidateStat.isDirectory()) throw new Error(`Expected a directory below the selected workspace: ${path}`)
    return candidate
  }

  private async pathResolve(workspace: Workspace, path: string): Promise<string> {
    const candidate = resolve(workspace.root, relativePath(path))
    if (!isWithin(workspace.root, candidate)) throw new Error(`Path escapes the selected workspace: ${path}`)
    const ancestor = await nearestExistingAncestor(candidate)
    const canonicalAncestor = await realpath(ancestor)
    if (!isWithin(workspace.root, canonicalAncestor)) {
      throw new Error(`Path resolves through a location outside the selected workspace: ${path}`)
    }
    return candidate
  }

  private pathDisplay(workspace: Workspace, path: string): string {
    const displayed = relative(workspace.root, path)
    return displayed || '.'
  }

  private async patchPathsValidate(workspace: Workspace, patch: string): Promise<void> {
    const paths = new Set<string>()
    for (const line of patch.split(/\r?\n/)) {
      const diffMatch = line.match(/^diff --git a\/(.+) b\/(.+)$/)
      if (diffMatch) {
        paths.add(diffMatch[1])
        paths.add(diffMatch[2])
        continue
      }
      const fileMatch = line.match(/^(?:---|\+\+\+) (?:a\/|b\/)?(.+?)(?:\t.*)?$/)
      if (fileMatch && fileMatch[1] !== '/dev/null') paths.add(fileMatch[1])
      const moveMatch = line.match(/^(?:rename from|rename to|copy from|copy to) (.+)$/)
      if (moveMatch) paths.add(moveMatch[1])
    }
    if (paths.size === 0) throw new Error('apply_patch requires a unified Git patch with file paths')
    for (const path of paths) {
      if (path.startsWith('"') || path.endsWith('"')) {
        throw new Error('apply_patch does not accept quoted Git patch paths')
      }
      await this.pathResolve(workspace, path)
    }
  }
}
