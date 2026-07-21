import type { UserConfig } from 'electron-vite'

export default {
  main: {
    build: {
      externalizeDeps: {
        exclude: ['extends-hono']
      }
    }
  }
} satisfies UserConfig
