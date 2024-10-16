import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./Context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";



export const MonthlyIncomeContext = createContext();

export const MonthlyIncomeProvider = ({ children }) => {
    const { userId } = useContext(UserContext)
    const [monthlyIncome, setMonthlyIncome] = useState([])

    const incomeCollectionRef = collection(db, 'monthlyIncome')

    useEffect(() => {
        const getMonthlyIncomeList = async () => {
            try {
                if (userId !== '') {
                    const setQuery = await query(incomeCollectionRef, where('uid', '==', userId));
                    const data = (await getDocs(setQuery))
                    const incomeData = data.docs.map(item => item.data())
                    setMonthlyIncome(incomeData)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getMonthlyIncomeList()
    }, [userId])

    return <MonthlyIncomeContext.Provider value={{ monthlyIncome, setMonthlyIncome }}>
        {children}
    </MonthlyIncomeContext.Provider>
}
