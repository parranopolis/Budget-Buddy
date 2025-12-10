// import { Navigate, Outlet, useNavigate } from "react-router-dom"
// import { auth } from "../../services/firebaseConfig"
// import { onAuthStateChanged } from "firebase/auth"
// import { useContext, useEffect } from "react"
// import { UserContext } from "../Context/Context"

// export function ProtectedRoute({ children }) {
//     const { setUserId } = useContext(UserContext)
//     const reRoute = useNavigate()

//     useEffect(() => {
//         onAuthStateChanged(auth, (user) => {
//             if (user == null) {
//                 reRoute('/login')
//             } else {
//                 setUserId(user.uid)
//             }
//         })
//     })

//     return <Outlet />


// }


import { Outlet, useNavigate } from "react-router-dom"
import { auth } from "../../services/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import { useContext, useEffect } from "react"
import { UserContext } from "../Context/Context"
import { useLocation } from "react-router-dom"
import { monthlyCollectionContext} from "../Context/ExpensesContext"

export function ProtectedRoute({ children }) {
    const { setUserId } = useContext(UserContext)
    const { setLocationRef} = useContext(monthlyCollectionContext)
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
    }, [reRoute])

    return <Outlet />
}
