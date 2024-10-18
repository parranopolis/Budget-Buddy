import { useContext, useEffect, useState } from "react"
import { db } from "../../services/firebaseConfig"
import { getDocs, collection, query, where } from "firebase/firestore"
import { UserContext } from "../Context/Context"
import { NavBar, TopNavBar } from "../Components/NavBar"

import './../Styles/pages/MovementsHistory.css'

export function Records() {

    return (
        <>
            <TopNavBar title={'Records'} />
            <section className="container pathRecords">
                <span className="h5 is-path-active">Income</span>
                <span className="h5">Expense</span>
            </section>
            <ExpenseRecord />
            <IncomeRecords />
            <NavBar />
        </>
    )
}

function ExpenseRecord() {
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
            <div>
                {monthlyExpense != 0 ? monthlyExpense.map((data, index) => {
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
    // return (<>
    //     <h1>Expense Records</h1>
    // </>)
}

function IncomeRecords() {
    return (<>
        <h1>Income Records</h1>
    </>)
}
