import react from '@vitejs/plugin-react'
import { defineConfig, mergeConfig, type UserConfig } from 'electron-vite'
import rendererReact from 'electron-vite-config-lib/rendererReactPlugin/plugin'
delete process.env.ELECTRON_RUN_AS_NODE

export default defineConfig({
  renderer: {
    plugins: [
      react(),
      rendererReact(
        { otherPort: 8887 },
        [".", {
          WEB_NAME: JSON.stringify('mainapp'),
          API_PATH: JSON.stringify('/mainapp/api')
        }],
      )
    ]
  }
})
