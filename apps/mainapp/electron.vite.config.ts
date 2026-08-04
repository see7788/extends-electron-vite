import react from '@vitejs/plugin-react'
import { defineConfig, mergeConfig, type UserConfig } from 'electron-vite'
import localCodexUserConfig, { localCodexChatGptPreloadProject } from 'chatgpt-com-tocodex/userConfig.ts'
import preloadCreate from 'electron-vite-config-lib/preloadCreate/vite/index'
import rendererReact from 'electron-vite-config-lib/rendererReactPlugin/plugin'
import localCodexSetupPreloadProject from 'local-codex-setup-preload/project.ts'
import localCodexSetupRendererProject from 'local-codex-setup-renderer/project.ts'
delete process.env.ELECTRON_RUN_AS_NODE

const hostUserConfig = {
  preload: preloadCreate(
    { externalizeDeps: false },
    localCodexChatGptPreloadProject,
    localCodexSetupPreloadProject
  ),
  renderer: {
    plugins: [
      react(),
      rendererReact(
        { otherPort: 8887 },
        [".", {
          WEB_NAME: JSON.stringify('mainapp'),
          API_PATH: JSON.stringify('/mainapp/api')
        }],
        localCodexSetupRendererProject
      )
    ]
  }
} satisfies UserConfig

export default defineConfig(mergeConfig(localCodexUserConfig, hostUserConfig))
