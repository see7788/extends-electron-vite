import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { UserConfig } from 'electron-vite'

const packageDirectory = dirname(fileURLToPath(import.meta.url))

export const localCodexRuntimeFiles = {
  chatGptPreload: 'local-codex-chatgpt.cjs',
  setupPreload: 'local-codex-setup.cjs',
  setupRenderer: 'libs/chatgpt-com-tocodex/chatgpt/main.browserWindow/setup/renderer/index.html'
} as const

const localCodexUserConfig = {
  main: {
    build: {
      externalizeDeps: {
        exclude: ['chatgpt-com-tocodex']
      }
    }
  },
  preload: {
    build: {
      externalizeDeps: false,
      rollupOptions: {
        output: {
          format: 'cjs'
        },
        input: {
          'local-codex-chatgpt': resolve(packageDirectory, 'chatgpt', 'preload', 'index.ts'),
          'local-codex-setup': resolve(
            packageDirectory,
            'chatgpt',
            'main.browserWindow',
            'setup',
            'preload.ts'
          )
        }
      }
    }
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          'local-codex-setup': resolve(
            packageDirectory,
            'chatgpt',
            'main.browserWindow',
            'setup',
            'renderer',
            'index.html'
          )
        }
      }
    }
  }
} satisfies UserConfig

export default localCodexUserConfig
