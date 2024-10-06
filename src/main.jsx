import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import { Home } from './Pages/Home'
import { Login } from './Pages/Auth/Login'
import { PasswordRecovery } from './Pages/Auth/passwordRecovery'
import { CreateAccount } from './Pages/Auth/CreateAccount'
import { DailyExpense } from './Pages/Movements'


const root = createRoot(document.getElementById('root'))

const user = false
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: 'login',
    element: <Login />
  },
  {
    path: 'password_recovery',
    element: <PasswordRecovery />
  },
  {
    path: 'create_account',
    element: <CreateAccount />
  },
  {
    path: 'DailyExpense',
    element: <DailyExpense />
  }
])

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
