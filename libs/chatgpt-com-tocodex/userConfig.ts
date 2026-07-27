import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { UserConfig } from 'electron-vite'
import preloadPath from 'electron.vite.config/preloadCreate/path'

const packageDirectory = dirname(fileURLToPath(import.meta.url))

export const localCodexRuntimeFiles = {
  chatGptPreload: preloadPath('local-codex-chatgpt'),
  setupPreload: preloadPath('local-codex-setup'),
  setupRenderer: 'local-codex-setup'
} as const

export const localCodexPreloadEntries = {
  'local-codex-chatgpt': resolve(packageDirectory, 'chatgpt', 'preload', 'index.ts'),
  'local-codex-setup': resolve(packageDirectory, 'chatgpt', 'main.browserWindow', 'setup', 'preload.ts')
}

export const localCodexRendererEntries = {
  'local-codex-setup': resolve(packageDirectory, 'chatgpt', 'main.browserWindow', 'setup', 'renderer', 'index.html')
}

const localCodexUserConfig = {
  main: {
    build: {
      externalizeDeps: {
        exclude: ['chatgpt-com-tocodex']
      }
    }
  },
} satisfies UserConfig

export default localCodexUserConfig
