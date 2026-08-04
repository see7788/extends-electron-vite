import { dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const localCodexSetupRendererProject: [path: string] = [
  relative(process.cwd(), dirname(fileURLToPath(import.meta.url)))
]

export default localCodexSetupRendererProject
