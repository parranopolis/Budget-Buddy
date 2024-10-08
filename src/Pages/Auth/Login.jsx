import { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import { UseGoogleAccount } from "../../Components/AuthMethods"
import { LoginForm } from "../../Components/Forms"
import '../../Styles/Auth/Login.css'
import { auth } from "../../../services/firebaseConfig"
import { UserContext } from "../../Context/Context"

export function Login() {
    return (
        <>
            <article className="login">
                <section className="login-header">
                    <div className="logo">Logo</div>
                    <div className="center h3">Sign In to Budget Buddy</div>
                </section>
                <section className="login-Form">
                    <UseGoogleAccount text={'Continue with Google'} />
                    <span className="h6 center divisor">OR</span>
                    <LoginForm />
                </section>
            </article>
        </>
    )
}