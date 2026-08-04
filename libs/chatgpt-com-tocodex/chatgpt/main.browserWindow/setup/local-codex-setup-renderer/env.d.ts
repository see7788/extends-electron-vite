import type { LocalCodexSetupBridge } from 'local-codex-setup-preload/index.tsx'

declare global {
  interface Window {
    localCodexSetup: LocalCodexSetupBridge
  }
}
