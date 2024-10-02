import { useEffect } from "react"
import { redirect } from "react-router-dom"

export function Home() {
    redirect('login')

    return (
        <>
            <h1>This is Home</h1>
        </>
    )
}