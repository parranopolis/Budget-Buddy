import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import { TimeProvider, UserProvider } from './Context/Context'

import { Home } from './Pages/Home'
import { Login } from './Pages/Auth/Login'
import { PasswordRecovery } from './Pages/Auth/PasswordRecovery'
import { CreateAccount } from './Pages/Auth/CreateAccount'
import { DailyExpense, AddIncome } from './Pages/Movements'
import { ProtectedRoute } from './Components/ProtetedRoute'
import { Activity } from './Pages/MovementsHistory'
import { MonthlyCollectionProvider } from './Context/ExpensesContext'
import { MonthlyIncomeProvider } from './Context/IncomeContext'
import { MerchanDetail } from './Components/Records'


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
        element: <Activity />
      },
      {
        path: 'DailyExpense',
        element: <DailyExpense />
      },
      {
        path: 'addIncome',
        element: <AddIncome />
      },
      {
        path: 'merchanDetail/:id',
        element: <MerchanDetail />
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
      <MonthlyCollectionProvider>
        <MonthlyIncomeProvider>
          <TimeProvider>
            <RouterProvider router={router} />
          </TimeProvider>
        </MonthlyIncomeProvider>
      </MonthlyCollectionProvider>
    </UserProvider>
  </StrictMode>,
)
