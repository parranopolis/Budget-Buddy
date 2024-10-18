import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { UserContext } from "./Context";

export const monthlyCollectionContext = createContext();

export const MonthlyCollectionProvider = ({ children }) => {
    const { userId } = useContext(UserContext)
    const [monthlyExpense, setMonthlyExpense] = useState([])
    const [itemId, setItemId] = useState('')
    const expenseCollectionRef = collection(db, 'monthlyExpenses')

    useEffect(() => {
        const getMonthlyExpenseList = async () => {
            try {
                if (userId !== '') {
                    const setQuery = await query(expenseCollectionRef, where('uid', '==', userId))
                    const data = (await getDocs(setQuery))
                    const expenseData = data.docs.map(item => ({
                        id: item.id,
                        ...item.data()
                    }))
                    setMonthlyExpense(expenseData)
                    data.docs.map(i => {
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
        getMonthlyExpenseList()
    }, [userId, setMonthlyExpense])
    return <monthlyCollectionContext.Provider value={{ monthlyExpense, setMonthlyExpense, setItemId, itemId }}>
        {children}
    </monthlyCollectionContext.Provider>
}