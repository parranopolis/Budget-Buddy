import { Link, redirect, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { buildingBranch } from "../Logic"

import { auth } from "../../services/firebaseConfig"
import { signOut } from "firebase/auth"
import { UserContext } from "../Context/Context"

export function ProfileMenu() {
    const [state, setState] = useState('disable')
    var q = window.innerHeight - 70

    const reRoute = useNavigate()
    const { userId, setUserId } = useContext(UserContext)

    const logAuth = async () => {
        try {
            await signOut(auth).then((result) => {
                setUserId(null)
                reRoute('/login')
            })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <section className="profile z-depth-3 col" onClick={e => state != 'is-active' ? setState('is-active') : setState('disable')}>
                <section className="profileCircle col s1" >
                </section>
            </section>
            <div className={`collection z-depth-3 ${state} profileMenu`}>
                <Link to="/" className="collection-item profileOptions">Home</Link>
                <Link to="#!" onClick={buildingBranch} className="collection-item profileOptions">Settings</Link>
                <Link onClick={logAuth} className="collection-item profileOptions">Logout</Link>
            </div>
        </>
    )
}