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
import { TransactionDetail } from './Pages/TransactionDetail'
import { TestingComponent } from './Components/TestingComponent'
import { Reports } from './Pages/Reports'
import { UploadRecords} from './Pages/uploadRecords'

const root = createRoot(document.getElementById('root'))
// actualizar el estado luego de hacer cambios en el ingreso o egreso de dinero
// const user = false
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
      },
      {
        path: 'transactionDetail/:id',
        element: <TransactionDetail />
      },
      {
        path:'testing',
        element: <TestingComponent/>
      },
      {
        path:'reports',
        element: <Reports/>
      },
      {
        path:'uploadRecords',
        element: <UploadRecords/>
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
  },
  // {
  //   path: 'updateRecords',
  //   element:<UpdateRecords/>
  // }
])

root.render(

  <UserProvider>
    <MonthlyCollectionProvider>
      <MonthlyIncomeProvider>
        <TimeProvider>
          <RouterProvider router={router} />
        </TimeProvider>
      </MonthlyIncomeProvider>
    </MonthlyCollectionProvider>
  </UserProvider>
)
