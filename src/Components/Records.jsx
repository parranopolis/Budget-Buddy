import { useContext, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"

import { monthlyCollectionContext } from "../Context/ExpensesContext"
import { MonthlyIncomeContext } from "../Context/IncomeContext"

import './../Styles/components/Records.css'
import { NavBar, TopNavBar } from "./NavBar"
import { db } from "../../services/firebaseConfig"

export function TotalSum({ title, collectionRef }) {
    const { monthlyIncome } = useContext(MonthlyIncomeContext)
    const { monthlyExpense } = useContext(monthlyCollectionContext)
    const [totalAmount, setTotalAmount] = useState(0)
    const q = [monthlyExpense, monthlyIncome]

    const calcTotal = (collectionName) => {
        const total = collectionName.reduce((sum, entry) => {
            return sum + (typeof entry.amount === 'string' ? parseFloat(entry.amount) : entry.amount)

        }, 0)
        return total.toFixed(2)
    }

    useEffect(() => {

        let total = 0

        if (collectionRef === 'monthlyIncome') {
            total = calcTotal(monthlyIncome)
        } else if (collectionRef === 'monthlyExpenses') {
            total = calcTotal(monthlyExpense)
        }
        setTotalAmount(total)

    }, [monthlyIncome, monthlyExpense, collectionRef])
    return (
        <>
            <section className="box">
                <div className="h6">Total {title}</div>
                <div className="h2 totalAmount">${totalAmount}</div>
            </section>
        </>
    )
}

export function Transactions() {
    const { monthlyExpense } = useContext(monthlyCollectionContext)
    const [month, setMonth] = useState('')
    const [expenses, setExpenses] = useState([])
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    useEffect(() => {
        const filteredData = monthlyExpense.filter(entry => { // Modified this to filter throw a prop array of object 
            if (entry.date) {
                const entryDate = new Date(entry.date)
                const entryMonth = entryDate.getMonth()
                const entryYear = entryDate.getFullYear()

                return entryMonth === currentMonth && entryYear === currentYear
            }
            return false
        })
        const getMonthName = () => {
            const date = new Date(currentYear, currentMonth, 2)
            return date.toLocaleDateString('en-US', { month: "long" })
        }
        const sortedData = filteredData.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateB - dateA
        })
        setMonth(getMonthName)
        setExpenses(sortedData)

    }, [monthlyExpense])

    return (
        <>
            <section>
                <span className='h5'>Latest transactions of {month}</span>

                {expenses.map((item) => {
                    return (
                        <section key={item.id} className="transactionCard">
                            <section className="card-image">
                                <img src="#" alt="" />
                            </section>
                            <section className="card-title">
                                <div>
                                    <span className="h5"><ion-icon name="storefront-outline"></ion-icon> {item.store}</span>
                                </div>
                                <div>
                                    <span><ion-icon name="calendar-number-outline"></ion-icon> {item.date}</span>
                                </div>
                            </section>
                            <Link to={`./MerchanDetail/${item.store}`} state={{ store: item.store }}> {/* Merchan detail */}
                                <section className="card-amount">
                                    <div>
                                        <span className="h6 price">$ {item.amount}</span>
                                    </div>
                                    <div>
                                        <ion-icon name="chevron-forward-outline"></ion-icon>
                                    </div>
                                </section></Link>
                        </section>
                    )
                })}
            </section>
        </>
    )
}

export function MerchanDetail() {
    const { monthlyExpense } = useContext(monthlyCollectionContext)
    const [month, setMonth] = useState('')
    const [expenses, setExpenses] = useState([])
    const [totalSpend, setTotalSpend] = useState(0)
    let storeName = useLocation()


    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    useEffect(() => {
        let number = 0
        const filteredData = monthlyExpense.filter(entry => { // Modified this to filter throw a prop array of object 
            if (entry.date) {
                const entryDate = new Date(entry.date)
                const entryMonth = entryDate.getMonth()
                const entryYear = entryDate.getFullYear()

                return entryMonth === currentMonth && entryYear === currentYear
            }
            return false
        })
        const getMonthName = () => {
            const date = new Date(currentYear, currentMonth, 2)
            return date.toLocaleDateString('en-US', { month: "long" })
        }
        const sortedData = filteredData.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateB - dateA
        })

        const merchanDataList = sortedData.filter((field) => {
            if (field.store == storeName.state.store) {
                number = number + parseFloat(field.amount)
                return field
            }
        })
        setTotalSpend(number)
        setMonth(getMonthName)
        setExpenses(merchanDataList)
    }, [monthlyExpense])

    return (
        <>
            <TopNavBar title={'Merchan Detail'} />

            <div className="container">
                <article className="presentation">
                    <section className="card-image">
                        <img src="#" alt="" />
                    </section>
                    <section>
                        <div className="h6">Food</div>
                        <div className="h3">{storeName.state.store}</div>
                    </section>
                </article>

                <article>
                    <span className="h4">Transaction History</span>{/* Show all transactions related with ths Company */}
                    {expenses.map(item => {
                        return (
                            <section className="transactionHistory" key={item.id}>
                                <div className="itemA">
                                    <div className=" h6">{item.field}</div>
                                    <div className=" p-large">{item.date}</div>
                                </div>
                                <div className="itemB">
                                    <div className="h4 price">$ {item.amount}</div>
                                    <div className="itemB-Actions">
                                        <span className="h5"><ion-icon name="document-text-outline"></ion-icon></span>
                                        <span className="h5"><ion-icon name="trash-outline"></ion-icon></span>
                                        <Link to={'/'}><span className="h5"><ion-icon name="chevron-forward-outline"></ion-icon></span></Link> {/* transaction Detail */}
                                    </div>
                                </div>
                            </section>
                        )
                    })}
                </article>
                <aside className="totalCompanyExpense">
                    <div className="h6" >Total {month}</div>
                    <div className="h4 price">${totalSpend}</div>
                </aside>
            </div >
            <NavBar />
        </>
    )
}


{/* <article className="review">
                    <section>
                        <div>
                            <span>time/day</span>
                            <span>price</span>
                        </div>
                        <div>map</div>
                        <div>
                            <span>Name</span>
                            <span><ion-icon name="chevron-forward-outline"></ion-icon></span> 
                        </div>
                    </section>
                </article>*/}