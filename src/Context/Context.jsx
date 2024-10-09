import { createContext, useEffect, useState } from "react";
import { auth } from "../../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext();

const UID = auth

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState('')

    const q = async () => {

        await onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid)
                console.log(userId)
            } else {
                console.log('user is signed out')
            }
        })

    }

    return <UserContext.Provider value={{ userId, setUserId }}>
        {children}
    </UserContext.Provider>
}