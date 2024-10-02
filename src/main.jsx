import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

import { Home } from './Pages/Home'
import { Auth, SignIn } from './Pages/Auth'



const root = createRoot(document.getElementById('root'))


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: 'login',
    element: <Auth />
  },
  {
    path: 'signIn',
    element: <SignIn />
  }
])

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
