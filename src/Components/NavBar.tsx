import { useNavigate, Link, useLocation } from "react-router-dom"
import { useRef, useState } from 'react'
import { auth } from "../services/firebaseConfig.ts"
import { signOut } from "firebase/auth"
import '../Styles/components/NavBar.css'
import '../Styles/main.css'

export function NavBar() {
    const reRoute = useNavigate()
    // const { userId, setUserId } = useContext(UserContext)
    const logAuth = async () => {
        try {
            await signOut(auth).then(() => {
                // setUserId(null)
                reRoute('/login')
            })
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <section className="bg-NavBar text-white flex justify-around py-8 text-2xl fixed bottom-0 inset-x-0 w-full z-50 ">
            {/* <section className="navBar shadow z-depth-3"> */}
                <div><Link className="" to={'/'}><ion-icon name="home-outline"></ion-icon></Link></div>
                <div><Link to={'/reports'}><ion-icon name="analytics-outline"></ion-icon></Link></div>
                <div><Link to={'/movementHistory'}><ion-icon name="stats-chart-outline"></ion-icon></Link></div>
                <div><Link to={'/login'} onClick={logAuth}><ion-icon name="log-out-outline"></ion-icon></Link></div>
            </section>
        </>
    )
}
