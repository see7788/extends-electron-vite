import { dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { path_t } from 'electron-vite-config-lib/public'

const path = relative(process.cwd(), dirname(fileURLToPath(import.meta.url)))
const localCodexSetupRendererProject = (
  path.startsWith('.') ? path : `./${path}`
) as path_t

export default localCodexSetupRendererProject
