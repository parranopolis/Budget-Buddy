
import { GoogleButton } from "./Buttons"

export function UseGoogleAccount({ text }) {
    
    return (
        <>
            {/* <button onClick={SignInWithGoogle}>Sign In With Google</button> */}
            <GoogleButton text={text} />
        </>
    )
}
