import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import { auth } from "../../services/firebaseConfig"


import { Submit } from "./Buttons"
import '../Styles/components/Forms.css'
import '../Styles/main.css'

export function LoginForm({ link, path }) {
    const [email, setEmail] = useState() //crear un contexto global
    const [password, setPassword] = useState() //crear un contexto global

    const reRoute = useNavigate()
    return (
        <section className="authForm">
            <div className="row">
                <div className="input-field col s12">
                    <input type="text"
                        placeholder="email..."
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="active" htmlFor="first_name2">Email</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <input
                        placeholder="*******"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="active" htmlFor="first_name2">Password</label>
                </div>
            </div>
            <Submit text="Log in " />
            <div className="authForm-optionaMessage p-large">
                <Link to={`/${path}`}>{link}</Link>
            </div>
        </section >
    )
}