import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { UserConfig } from 'electron-vite'
import preloadPath from 'electron-vite-config-lib/preloadCreate/electron'

const packageDirectory = dirname(fileURLToPath(import.meta.url))
const cwdPath = (...path: string[]) => relative(
  process.cwd(),
  resolve(packageDirectory, ...path)
)

export const localCodexRuntimeFiles = {
  chatGptPreload: preloadPath('local-codex-chatgpt'),
  setupPreload: preloadPath('local-codex-setup-preload'),
  setupRenderer: 'local-codex-setup-renderer'
} as const

export const localCodexChatGptPreloadProject: [path: string] = [
  cwdPath('chatgpt', 'local-codex-chatgpt')
]

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
