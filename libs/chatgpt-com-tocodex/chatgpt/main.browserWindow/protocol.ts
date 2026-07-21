export const localCodexSetupChannels = {
  setupAction: 'local-codex-setup-action',
  setupState: 'local-codex-setup-state',
  setupStateGet: 'local-codex-setup-state-get'
} as const

export type LocalCodexSetupPhase =
  | 'mcp-starting'
  | 'needs-login'
  | 'needs-workspace'
  | 'ready'
  | 'error'

export type LocalCodexSetupState = {
  login: 'checking' | 'signed-in' | 'signed-out'
  message: string
  mcpReady: boolean
  phase: LocalCodexSetupPhase
  tone: 'ok' | 'warn' | 'error'
  toolCount: number
  workspaceReady: boolean
  workspaceRoot: string | undefined
}

export type LocalCodexSetupAction =
  | { type: 'choose-workspace' }
  | { type: 'chatgpt-login-open' }
  | { type: 'chatgpt-reload' }
  | { type: 'login-state-copy'; username: string }
  | { type: 'login-state-paste' }

export type LocalCodexSetupActionResult = {
  username?: string
}
