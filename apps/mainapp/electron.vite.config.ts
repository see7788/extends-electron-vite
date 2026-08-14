import { defineConfig } from 'electron-vite'
import mainPlugin from 'electron-vite-config-lib/mainPlugin/plugin'

const ports = [3000, 3001] as const

export default defineConfig({
  main: {
    plugins: [mainPlugin({ ports })]
  }
})
