import { createContext, useEffect, useState } from "react";
import { auth } from "../../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState()

    return <UserContext.Provider value={{ userId, setUserId }}>
        {children}
    </UserContext.Provider>
}