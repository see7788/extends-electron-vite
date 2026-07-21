import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SetupApp from './SetupApp'

const root = document.getElementById('root')
if (root === null) throw new Error('Local Codex setup renderer root is missing')

createRoot(root).render(
  <StrictMode>
    <SetupApp />
  </StrictMode>
)
