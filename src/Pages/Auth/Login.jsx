import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import { UseGoogleAccount } from "../../Components/AuthMethods"
import { LoginForm } from "../../Components/Forms"
import '../../Styles/Auth/Login.css'
import { SignIn, LinkButton } from "../../Components/Buttons"


export function Login() {

    return (
        <>
            <article className="login">
                <section className="login-logo">
                    Logo
                </section>
                {/* <section className="formContainer"> */}
                <section className="login-Form">
                    <UseGoogleAccount text={'Log in with Google'} />

                    <hr className="divisor" />
                    <LoginForm link='Forgot my password' path={'password_recovery'} />
                </section>
                <section className="login-SignIn">

                    <LinkButton className={'btn SubmitButton p-large '} />
                </section>
            </article>
        </>
    )
}