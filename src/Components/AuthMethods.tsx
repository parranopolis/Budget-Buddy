
import { GoogleButton } from "./Buttons.tsx"

interface AuthMethodsProps {
    text: string
}

export function UseGoogleAccount({ text }: AuthMethodsProps) {
    
    return (
        <>
            {/* <button onClick={SignInWithGoogle}>Sign In With Google</button> */}
            <GoogleButton text={text} />
        </>
    )
}
