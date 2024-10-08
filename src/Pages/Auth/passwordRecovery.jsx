import { PasswordRecoveryForm } from "../../Components/Forms"
export function PasswordRecovery() {
    return (
        <>
            <article className="login">
                <section className="login-header">
                    <div className="logo">Logo</div>
                    <div className="center h3">Enter your email to reset password</div>
                </section>
                <section className="login-Form">
                    <PasswordRecoveryForm />
                </section>
            </article>
        </>
    )
}