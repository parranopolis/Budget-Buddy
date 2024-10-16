import { createContext, useEffect, useState } from "react";
import { auth } from "../../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext();

const UID = auth

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState('')
    const [userName, setUserName] = useState('')

    useEffect(() => {
        const data = async () => {

            await onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUserId(user.uid)
                    setUserName(user.displayName)
                } else {
                    console.log('user is signed out')
                }
            })
        }
        data()
    }, [])

    return <UserContext.Provider value={{ userId, setUserId, userName, setUserName }}>
        {children}
    </UserContext.Provider>
}