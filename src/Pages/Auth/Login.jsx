
import { UseGoogleAccount } from "../../Components/AuthMethods"
import { LoginForm } from "../../Components/Forms"
import '../../Styles/Auth/Login.css'

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