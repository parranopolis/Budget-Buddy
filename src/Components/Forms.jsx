import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"

import { auth } from "../../services/firebaseConfig"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"

import { UserContext } from "../Context/Context"

import { Submit } from "./Buttons"
import '../Styles/components/Forms.css'
import '../Styles/main.css'

export function LoginForm() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [loginError, setloginError] = useState('')
    const { userId, setUserId } = useContext(UserContext)
    const reRoute = useNavigate()

    const logIn = async () => {
        try {
            if (email == '' || password == '') {
                setloginError("Email or Password can't be empty")
                console.log(loginError)
                throw new Error(loginError)
            }
            else {
                await signInWithEmailAndPassword(auth, email, password).then(() => reRoute('/'))
            }
        } catch (error) {
            setloginError(error.code)
        }
    }

    return (
        <section className="authForm">
            <div className="center formError h6">
                <span>{loginError}</span>
            </div>
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
            <span onClick={logIn}>
                <Submit text="Log in" />
            </span>
            <div className="authForm-options p-large">
                {/* <Link to={`/password_recovery`}>Reset password</Link> */}
                <span>No account? </span><Link to={`/signin`}> Create one</Link>
            </div>
        </section >
    )
}

export function PasswordRecoveryForm() {
    return (
        <>
            <section className="authForm">
                <div className="row">
                    <div className="input-field col s12">
                        <input type="text"
                            placeholder="email..."
                            required
                        />
                        <label className="active" htmlFor="first_name2">Email</label>
                    </div>
                </div>
                <Submit text="Reset password" />
                <div className="authForm-options p-large">
                    <Link to={`/login`} className="center">Cancel</Link>
                </div>
            </section>
        </>
    )
}

export function SignIn() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [sigInError, setSigInError] = useState('')

    const singIn = async () => {
        try {
            if (email == '' || password == '') {
                setSigInError("Email or Password can't be empty")
                console.log(sigInError)
                throw new Error(sigInError)
            }
            else {
                await createUserWithEmailAndPassword(auth, email, password).then(() => reRoute('/'))
            }
        } catch (error) {
            setSigInError(error.code)
        }
    }
    const reRoute = useNavigate()
    return (
        <section className="authForm">
            <div className="center formError h6">
                <span>{sigInError}</span>
            </div>
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
            <span onClick={singIn}><Submit text="Create Account" /></span>
            <div className="authForm-options p-large">
                <span>Already have one? </span><Link to={`/login`}>Log in</Link>
            </div>
        </section >
    )
}