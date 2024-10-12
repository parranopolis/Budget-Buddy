import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import { UserProvider } from './Context/Context'

import { Home } from './Pages/Home'
import { Login } from './Pages/Auth/Login'
import { PasswordRecovery } from './Pages/Auth/PasswordRecovery'
import { CreateAccount } from './Pages/Auth/CreateAccount'
import { DailyExpense } from './Pages/Movements'
import { ProtectedRoute } from './Components/ProtetedRoute'
import { MovementsHistory } from './Pages/MovementsHistory'
import { AddIncome } from './Pages/AddIncome'


const root = createRoot(document.getElementById('root'))

const user = false
const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'movementHistory',
        element: <MovementsHistory />
      },
      {
        path: 'DailyExpense',
        element: <DailyExpense />
      },
      {
        path: 'addIncome',
        element: <AddIncome />
      }
    ]
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
    path: 'Signin',
    element: <CreateAccount />
  }
])

root.render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
