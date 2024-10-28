import { Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react"

import { monthlyCollectionContext } from "../Context/ExpensesContext"
import { TimeContext } from "../Context/Context"
import { MonthlyIncomeContext } from "../Context/IncomeContext"

import { NavBar, TopNavBar } from "../Components/NavBar"

import { filterDataBy, TotalSum2 } from "../Logic/functions"

import './../Styles/pages/MovementsHistory.css'

export function Activity() {

    const { monthlyIncome } = useContext(MonthlyIncomeContext)
    const { monthlyExpense } = useContext(monthlyCollectionContext)
    const { currentMonth, currentYear, currentMonthName } = useContext(TimeContext)

    const [status, setStatus] = useState({
        category: 'Expense',
        map: [],
        period: 'M',
        totalThisPeriod: 0
    })

    const handleShowCategory = () => {
        setStatus(prevStatus => ({
            ...prevStatus,
            category: prevStatus.category === 'Expense' ? 'Income' : "Expense",
        }))
    }

    const onPeriodState = (e) => {
        setStatus(prevStatus => ({
            ...prevStatus,
            period: e.target.id
        }))
    }
    useEffect(() => {
        const data = status.category === 'Expense' ? monthlyExpense : monthlyIncome
        const input = filterDataBy([data, status.category, currentMonth, currentYear, status.period])
        setStatus(prevStatus => ({
            ...prevStatus,
            map: input,
            totalThisPeriod: TotalSum2(input)
        }))
    }, [monthlyExpense, monthlyIncome, status.category, status.period])



    // Mover a otros componentes  --->

    const today = new Date()

    // calcula el domingo de la semana actual
    const currentDay = today.getDay()
    const sundayOfCurrentWeek = new Date(today)
    sundayOfCurrentWeek.setDate(today.getDate() - currentDay)

    // calcula el sabado de la semana actual
    const saturdayOfCurrentWeek = new Date(sundayOfCurrentWeek)
    saturdayOfCurrentWeek.setDate(sundayOfCurrentWeek.getDate() + 6)

    const q = `${today.toLocaleString('en-US', { month: 'short' })} ${sundayOfCurrentWeek.toLocaleDateString('en-US', { day: '2-digit' })} - ${saturdayOfCurrentWeek.toLocaleDateString('en-US', { day: 'numeric' })}`

    return (
        <>
            <TopNavBar title={'Records'} />
            <div className="container">
                <article>
                    <section>
                        <div className="center period">
                            <span
                                id="W"
                                onClick={onPeriodState}
                                className={`test ${status.period === 'W' ? 'isActive' : ''}`}
                            >
                                W
                            </span>
                            <span
                                id="M"
                                onClick={onPeriodState}
                                className={`test ${status.period === 'M' ? 'isActive' : ''}`}
                            >
                                M
                            </span>
                            <span
                                id="Y"
                                onClick={onPeriodState}
                                className={`test ${status.period === 'Y' ? 'isActive' : ''}`}
                            >
                                Y
                            </span>
                        </div>
                        <br />
                        <div>
                            {/* <span className="h3">{currentMonth} {currentYear}</span> */}
                            {status.period === 'W' ? (
                                <span className="h3"> {q}</span>
                            ) : status.period === 'M' ? (
                                <span className="h3" >{currentMonthName}</span>
                            ) : (
                                <span className="h3" >{currentYear}</span>
                            )}
                        </div>
                        <br />
                        <div>
                            <section>
                                <div>Total {status.category}</div>
                                <div className='h2 totalAmount'>{status.totalThisPeriod}</div>
                                <span className="h6">Total Transactions in this period {status.map.length}</span>
                            </section>
                            {/* <section>
                                charts
                            </section> */}
                        </div>
                    </section>
                </article>
                <hr />
                <br />
                <article>
                    <section>
                        <div>
                            <span className="h4">{status.category}</span>
                            <span onClick={handleShowCategory} className="p-large right" style={{ color: '#f36c9c' }}>Show {status.category === "Income" ? 'Expense' : "Income"}<ion-icon name="chevron-forward-outline"></ion-icon></span>
                        </div>
                        {/* <div>
                            <span className="">filter : Category</span>
                        </div> */}
                    </section>
                    <section>
                        <DataList data={status.map} category={status.category}></DataList>
                    </section>
                </article>
            </div>
            <NavBar />
        </>
    )
}

function DataList({ data, category }) {
    return (
        <>
            {data != 0 ? data.map(data => {
                return (
                    <div key={data.id} className="transactionList">
                        {/* <Link to={`/transactionDetail/:${data.id}`}> */}
                        <Link to={`/MerchanDetail/${data.store}`} state={{ store: data.store }}> {/* Merchan detail */}

                            <div className="itemA">
                                <span className="h4">{category === 'Income' ? data.from : data.store}</span>
                                <span className="h5 price">${data.amount} <ion-icon name="chevron-forward-outline"></ion-icon></span>
                            </div>
                            <div className="itemB">
                                <span className="p-large price">{data.date}</span>
                                <span className="h6">{data.field}</span>
                            </div>
                        </Link>
                    </div>
                )
            }) : <h4>No data To Show</h4>}
        </>
    )
}
function ExpenseRecord({ data }) {
    return (
        <>
            {data != 0 ? data.map((data, index) => {
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
        </>
    )
}

function IncomeRecords({ data }) {
    return (
        <>
            <div>
                {data != 0 ? data.map(item => {
                    return (
                        <div key={item.id}>
                            <div>{item.from}</div>
                            <div>{item.date}</div>
                            <div>{item.id}</div>
                            <div>{item.amount}</div>
                            <hr />
                        </div>
                    )
                }) : <span>no data</span>}
            </div>
        </>
    )
}
