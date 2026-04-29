import { createContext, useEffect, useState } from "react";
import { auth } from "../services/firebaseConfig.ts";
import { onAuthStateChanged } from "firebase/auth";

interface UserContextType {
    userId: string | null,
    userName: string | null,
    setUserId: React.Dispatch<React.SetStateAction<string | null>>,
    setUserName: React.Dispatch<React.SetStateAction<string | null>>
}

interface TimeContextType {
    currentYear:number,
    currentMonthName:string,
    currentMonth:number
}

export const UserContext = createContext<UserContextType | null>(null);
export const TimeContext = createContext<TimeContextType | null>(null);

export const UserProvider = ({ children} : {children: React.ReactNode}) => {
    const [userId, setUserId] = useState<string | null>(null)
    const [userName, setUserName] = useState<string | null>(null)

    useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUserId(user.uid)
                    setUserName(user.displayName)
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

export const TimeProvider = ({ children } : {children: React.ReactNode}) => {
    const [currentYear, setCurrentYear] = useState<number>(0)
    const [currentMonthName, setCurrentMonthName] = useState<string>('')
    const [currentMonth, setCurrentMonth] = useState<number>(0)

    useEffect(() => {
        const getCurrentMonth = new Date().getMonth()
        const getCurrentYear = new Date().getFullYear()

        const getMonthName = () => {
            const date = new Date(getCurrentYear, getCurrentMonth, 2)
            return date.toLocaleDateString('en-US', { month: "long" })
        }
        setCurrentMonthName(getMonthName())
        setCurrentMonth(getCurrentMonth)
        setCurrentYear(getCurrentYear)
    },[])

    return <TimeContext.Provider value={{ currentMonth, currentYear, currentMonthName }}>
        {children}
    </TimeContext.Provider>
}