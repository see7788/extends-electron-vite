import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import packageJson from './package.json' with { type: 'json' }

const { host } = packageJson.config
export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    server: {
      host
    },
    plugins: [react()]
  }
})
