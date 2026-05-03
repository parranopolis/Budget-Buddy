
import { useContext, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../services/firebaseConfig.ts"
import { UserContext, useUserContext } from "../Context/Context.tsx"
import { monthlyCollectionContext} from "../Context/ExpensesContext.tsx"

export function ProtectedRoute() {
    const { setUserId } = useContext(UserContext) !
    const { setLocationRef} = useContext(monthlyCollectionContext)!
    const reRoute = useNavigate()
    const location = useLocation()


    useEffect(() =>{
        setLocationRef(location.pathname)
    },[location.pathname, setLocationRef])

    useEffect(() => {
        // nos suscribimos una sola vez al cambio de auth
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user == null) {
                reRoute('/login')
            } else {
                setUserId(user.uid)
            }
        })

        // limpiamos el listener al desmontar el componente
        return () => {
            unsubscribe()
        }
    }, [reRoute,setUserId])

    return <Outlet />
}
