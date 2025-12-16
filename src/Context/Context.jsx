import { createContext, useEffect, useState } from "react";
import { auth } from "../../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext();
export const TimeContext = createContext();

const UID = auth

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState('')
    const [userName, setUserName] = useState('')

    useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUserId(user.uid)
                    setUserName(user.displayName)
                } else {
                    console.log('user is signed out')
                }
            })
        return () => {
            unsubscribe()
        }
    }, [])

    return <UserContext.Provider value={{ userId, setUserId, userName, setUserName }}>
        {children}
    </UserContext.Provider>
}

export const TimeProvider = ({ children }) => {
    const [currentYear, setCurrentYear] = useState()
    const [currentMonthName, setCurrentMonthName] = useState()
    const [currentMonth, setCurrentMonth] = useState()

    useEffect(() => {
        const getCurrentMonth = new Date().getMonth()
        const getCurrentYear = new Date().getFullYear()

        const getMonthName = () => {
            const date = new Date(getCurrentYear, getCurrentMonth, 2)
            return date.toLocaleDateString('en-US', { month: "long" })
        }
        setCurrentMonthName(getMonthName())
        setCurrentMonth(getCurrentMonth)
        setCurrentYear(parseInt(getCurrentYear))
    },[])

    return <TimeContext.Provider value={{ currentMonth, currentYear, currentMonthName }}>
        {children}
    </TimeContext.Provider>
}