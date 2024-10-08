import { UseGoogleAccount } from "../../Components/AuthMethods"
import { SignIn } from "../../Components/Forms"

export function CreateAccount() {

    return (
        <>
            <article className="login">
                <section className="login-header">
                    <div className="logo">Logo</div>
                    <div className="center h3">Sign up for Budget Buddy</div>
                </section>
                {/* <section className="formContainer"> */}
                <section className="login-Form">
                    <UseGoogleAccount text={'Continue with Google'} />

                    {/* <hr className="divisor" /> */}
                    <span className="h6 center divisor">OR</span>
                    <SignIn />
                </section>
            </article>
        </>
    )
}