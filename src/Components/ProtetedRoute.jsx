import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { auth } from "../../services/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import { useContext, useEffect } from "react"
import { UserContext } from "../Context/Context"

export function ProtectedRoute({ children }) {
    const { setUserId } = useContext(UserContext)
    const reRoute = useNavigate()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user == null) {
                reRoute('/login')
            } else {
                setUserId(user.uid)
            }
        })
    })

    return <Outlet />


}
