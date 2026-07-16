export type BridgeStatusTone = 'ok' | 'warn' | 'error'

export function bridgeErrorText(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`
  return String(error)
}

export function bridgeTextTruncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max)}\n...[truncated ${text.length - max} characters by Local Codex Bridge]`
}
