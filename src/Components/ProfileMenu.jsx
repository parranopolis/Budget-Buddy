import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { buildingBranch } from "../Logic"

import { auth } from "../../services/firebaseConfig"
import { signOut } from "firebase/auth"

export function ProfileMenu() {
    const [state, setState] = useState('disable')
    var q = window.innerHeight - 70
    let setDisplay = () => {
        let add = document.querySelector('#addMovement')
        add.style.diplay = 'block'
    }

    const reRoute = useNavigate()

    const logAuth = async () => {
        try {
            await signOut(auth)
            reRoute('/login')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <section className="profile z-depth-3 col" onClick={e => state != 'is-active' ? setState('is-active') : setState('disable')}>
                <section className="profileCircle col s1" >
                    {/* <ion-icon name="person-circle-outline"></ion-icon> */}
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