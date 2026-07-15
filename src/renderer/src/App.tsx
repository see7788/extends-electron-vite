import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TestRouter from './testrouter'

const appRouter = createBrowserRouter(
  [
    {
      path: '/testrouter',
      element: <TestRouter />,
    },
    {
      path: '*',
      element: <div>404</div>,
    },
  ],
  {
    basename: '/renderer',
  }
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
  </StrictMode>
)