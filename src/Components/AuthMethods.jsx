import { auth, googleProvider } from "../../services/firebaseConfig"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"

import { GoogleButton } from "./Buttons"

export function UseGoogleAccount({ text }) {

    // const SignInWithGoogle = async () => {
    //     try {
    //         await signInWithPopup(auth, googleProvider)
    //             .then((result) => {
    //                 // console.log(result.user.accessToken)
    //                 const credential = GoogleAuthProvider.credentialFromResult(result)
    //                 const token = credential.accessToken

    //                 const user = result.user

    //                 console.log(credential)

    //                 console.log(token)
    //                 reRoute('/')

    //             })
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }
    return (
        <>
            {/* <button onClick={SignInWithGoogle}>Sign In With Google</button> */}
            <GoogleButton text={text} />
        </>
    )
}

export function Logout() {
    const logout = async () => {
        try {
            await signOut(auth)
            console.log('you are logout')
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <button onClick={logout}>Logout</button>
        </>
    )
}