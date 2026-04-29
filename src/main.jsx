import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import { TimeProvider, UserProvider } from './Context/Context.tsx'

import { Home } from './Pages/Home'
import { Login } from './Pages/Auth/Login'
import { PasswordRecovery } from './Pages/Auth/PasswordRecovery'
import { CreateAccount } from './Pages/Auth/CreateAccount'
import { DailyExpense, AddIncome } from './Pages/Movements'
import { ProtectedRoute } from './Components/ProtetedRoute'
import { Activity } from './Pages/MovementsHistory'
import { MonthlyCollectionProvider } from './Context/ExpensesContext.tsx'
import { MerchanDetail } from './Components/Records'
import { TransactionDetail } from './Pages/TransactionDetail'
import { Reports } from './Pages/Reports'

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
        //se activa desde movementHistory, pero da error.
        // ruta entera: http://localhost:5173/movementHistory/MerchanDetail/Pepinos%20Pizza
        path: 'movementHistory',
        element: <Activity />
      },
      {
        path: 'DailyExpense',
        element: <DailyExpense />
      },
        {
        path: 'DailyExpense/:id',
        element: <DailyExpense />
      },
      {
        path: 'addIncome',
        element: <AddIncome />
      },
       {
        path: 'addIncome/:id',
        element: <AddIncome />
      },
      {
        // se activa desde home. funciona pero la UI esta incompleta. 
        // ruta http://localhost:5173/MerchanDetail/Pepinos%20Pizza
        // los estilos de esta estan reconstruidos en transactionDetail/companyName..
        // cambiar el companyName por el iD de la transaccion que debe mostrarse.
        path: 'merchanDetail/:id',
        element: <MerchanDetail />
      },
      {
        // path: 'transactionDetail/:id',
        path: '/transactionDetail/:type/:id',
        element: <TransactionDetail />
      },
      {
        path:'reports',
        element: <Reports/>
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
{/* <BrowserRouter> */}
      {/* <MonthlyIncomeProvider> */}
        <TimeProvider>
          <RouterProvider router={router} />
        </TimeProvider>
      {/* </MonthlyIncomeProvider> */}
{/* </BrowserRouter> */}
    </MonthlyCollectionProvider>
  </UserProvider>
)
