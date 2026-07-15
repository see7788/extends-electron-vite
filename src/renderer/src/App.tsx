import { RouterProvider, createHashRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TestRouter from './testrouter'

const appRouter = createHashRouter(
  [
    {
      path: '/testrouter',
      element: <TestRouter />,
      children: [
        {
          path: 'a',
          element: <div>a</div>,
        },
        {
          path: '*',
          element: <div>testrouter child not found</div>,
        },
      ],
    },
    {
      path: '*',
      element: <div>react 404</div>,
    },
  ]
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
  </StrictMode>
)