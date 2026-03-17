import { UseGoogleAccount } from "../../Components/AuthMethods"
import { SignIn } from "../../Components/Forms"

export function CreateAccount() {

    return (
        <>
            <article className="login">
                <section className="login-header">
                    <img src="/logo.webp" alt="" className="" />
                    {/* <div className="center h3">Sign up for Budget Buddy</div> */}
                </section>
                {/* <section className="formContainer"> */}
                <section className="flex flex-col gap-4 text-center py-8">
                    <UseGoogleAccount text={'Continue with Google'} />

                    {/* <hr className="divisor" /> */}
                    <span className="text-2xl">OR</span>
                    <SignIn />
                </section>
            </article>
        </>
    )
}