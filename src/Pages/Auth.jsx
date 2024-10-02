import { useState } from "react"
import { auth, googleProvider } from "../../services/firebaseConfig"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { redirect, useNavigate, Link } from "react-router-dom"

import { SignInWithGoogleComponent } from './../Components/AuthMethods'

export function Auth() {

    const [email, setEmail] = useState() //crear un contexto global
    const [password, setPassword] = useState() //crear un contexto global

    const reRoute = useNavigate()


    return (
        <>

            <div>
                <h1>Log in</h1>
                <input
                    placeholder="email... "
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input placeholder="password... "
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                {/* <button onClick={login}>Log in</button> */}

                <button>Create account</button>
            </div>
            <SignInWithGoogleComponent />
            <Link to={'/signIn'}>create account</Link>
        </>
    )
}

export function SignIn() {
    const singIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
                .then(result => {
                    console.log(result.user)
                    reRoute('/')

                })

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div>
                <h1>Create account</h1>
                <input
                    placeholder="email... "
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input placeholder="password... "
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={singIn}>Create account</button>
            </div>
            <SignInWithGoogleComponent />
            <Link to={'/login'}>Login</Link>

        </>
    )
}