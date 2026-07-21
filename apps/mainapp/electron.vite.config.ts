import { defineConfig, mergeConfig, type UserConfig } from 'electron-vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import localCodexUserConfig from 'chatgpt-com-tocodex/userConfig'

delete process.env.ELECTRON_RUN_AS_NODE

const { host, port } = packageJson
const mainappDirectory = dirname(fileURLToPath(import.meta.url))
const hostUserConfig = {
  main: {
    build: {}
  },
  preload: {},
  renderer: {
    root: resolve(mainappDirectory, '..'),
    build: {
      outDir: resolve(mainappDirectory, 'out', 'renderer'),
      rollupOptions: {
        input: {
          mainapp: resolve(mainappDirectory, 'src', 'renderer', 'index.html')
        }
      }
    },
    server: {
      proxy: {
        "/api": {
          target: `http://127.0.0.1:${port}/api`,
          changeOrigin: true,
        },
      },
      host,
      port: 8887
    },
    plugins: [react()]
  }
} satisfies UserConfig

for (const scope of ['preload', 'renderer'] as const) {
  const inputNameOwners = new Map<string, string>()
  for (const [owner, configuration] of [
    ['mainapp', hostUserConfig as UserConfig],
    ['chatgpt-com-tocodex', localCodexUserConfig as UserConfig]
  ] as const) {
    const input = (configuration[scope] as {
      build?: { rollupOptions?: { input?: string | string[] | Record<string, string> } }
    } | undefined)?.build?.rollupOptions?.input
    if (input === undefined) continue
    if (typeof input === 'string' || Array.isArray(input)) {
      throw new Error(`${scope}.build.rollupOptions.input must be a named object`)
    }
    for (const name of Object.keys(input)) {
      const existingOwner = inputNameOwners.get(name)
      if (existingOwner !== undefined) {
        throw new Error(`${scope} input name is declared by both ${existingOwner} and ${owner}: ${name}`)
      }
      inputNameOwners.set(name, owner)
    }
  }
}

export default defineConfig(mergeConfig(hostUserConfig, localCodexUserConfig))
