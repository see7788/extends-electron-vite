import { defineConfig, mergeConfig, type UserConfig } from 'electron-vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import localCodexUserConfig, {
  localCodexPreloadEntries,
  localCodexRendererEntries
} from 'chatgpt-com-tocodex/userConfig'
import preloadCreate from 'electron.vite.config/preloadCreate'
import rendererReactPlugin from 'electron.vite.config/rendererReactPlugin/plugin'
import store from "honoapp/src/store"
delete process.env.ELECTRON_RUN_AS_NODE

const { hostname: host, port } = store.getState().runtimeActions
const mainappDirectory = dirname(fileURLToPath(import.meta.url))
const hostUserConfig = {
  main: {
    build: {}
  },
  preload: preloadCreate({ externalizeDeps: false }, localCodexPreloadEntries),
  renderer: {
    root: resolve(mainappDirectory, '..'),
    build: {
      outDir: resolve(mainappDirectory, 'out', 'renderer'),
      rollupOptions: {}
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
    plugins: [rendererReactPlugin(
      { renderPort: 8887 },
      { mainapp: resolve(mainappDirectory, 'src', 'renderer', 'index.html') },
      localCodexRendererEntries
    )]
  }
} satisfies UserConfig

export default defineConfig(mergeConfig(hostUserConfig, localCodexUserConfig))
