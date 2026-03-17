
import { UseGoogleAccount } from "../../Components/AuthMethods"
import { LoginForm } from "../../Components/Forms"
import '../../Styles/Auth/Login.css'

export function Login() {
    return (
        <>
            <article className="login">
                <section className="login-header">
                    <img src="/logo.webp" alt="" className="" />

                    {/* <div className="logo"></div> */}
                    {/* <div className="text-center h3">Sign In</div> */}
                </section>
                <section className="flex flex-col gap-4 text-center py-8">
                    <UseGoogleAccount text={'Continue with Google'} />
                    <span className="text-2xl">OR</span>
                    <LoginForm />
                </section>
            </article>
        </>
    )
}