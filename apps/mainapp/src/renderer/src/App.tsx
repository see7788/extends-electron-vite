import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

declare const WEB_NAME: string
declare const API_PATH: string

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main style={{ fontFamily: 'sans-serif', padding: 32 }}>
      <h1>{WEB_NAME}</h1>
      <p>API: {API_PATH}</p>
    </main>
  </StrictMode>
)
