import { useContext, useEffect, useState } from "react"
import { db } from "../../services/firebaseConfig"
import { getDocs, collection, query, where } from "firebase/firestore"
import { UserContext } from "../Context/Context"

export function MovementsHistory() {
    const [monthlyExpense, setMonthlyExpense] = useState([])
    const expenseCollectionRef = collection(db, 'monthlyExpenses')
    const { userId } = useContext(UserContext)
    useEffect(() => {
        const getExpenseList = async () => {
            // set the state equual to that data
            try {
                if (userId !== '') {
                    const setQuery = await query(expenseCollectionRef, where('uid', '==', userId))
                    const data = (await getDocs(setQuery))
                    const expenseData = data.docs.map(item => item.data())
                    setMonthlyExpense(expenseData)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getExpenseList()
    }, [userId, setMonthlyExpense])
    return (
        <>
            <h1>Records</h1>
            <div>
                {monthlyExpense != 0 ? monthlyExpense.map((data, index) => {
                    console.log(index)
                    return (
                        <div key={index}>
                            <div className="h4">{data.store}</div>
                            <div className="h5">${data.amount}</div>
                            <div className="p-large">{data.field}</div>
                            <div className="p-large">{data.date}</div>
                            <div className="p-large">{data.payMethod}</div>
                            <div className="p-large">{data.uid}</div>
                            <hr />

                        </div>
                    )
                }) : <h4>Nothing here</h4>}
            </div>
        </>
    )
}