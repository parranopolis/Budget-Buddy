import { useContext, useState } from "react"
import { db } from "../../services/firebaseConfig"
import { NavBar, TopNavBar } from "../Components/NavBar"
import { MonthlyIncomeContext } from "../Context/IncomeContext"
import { monthlyCollectionContext } from "../Context/ExpensesContext"
import './../Styles/pages/MovementsHistory.css'

export function Activity() {

    const { monthlyIncome } = useContext(MonthlyIncomeContext)
    const { monthlyExpense } = useContext(monthlyCollectionContext)

    const [status, setStatus] = useState({
        category: 'Income'
    })

    const handleShowCategory = () => {
        setStatus(prevStatus => ({
            ...prevStatus,
            category: prevStatus.category === 'Expense' ? 'Income' : "Expense"
        }))
    }

    return (
        <>
            <TopNavBar title={'Records'} />
            <div className="container">
                <article>
                    <section>
                        <div>
                            <span>W | </span>
                            <span>M | </span>
                            <span>Y | </span>
                        </div>
                        <div>
                            <span>Month 2024</span>
                        </div>
                        <div>
                            <section>
                                <span>Total: {status.category === 'Income' ? 'Earned' : 'Spent'} in this Period</span>
                                <br />
                                <span>$3612</span><span> Total Transaccionses en este periodo: 58</span>
                            </section>
                            <section>
                                charts
                            </section>
                        </div>
                    </section>
                </article>
                <hr />
                <article>
                    <section>
                        <span>{status.category}</span>
                        <br />
                        <span onClick={handleShowCategory} className="h6" style={{ color: '#f36c9c' }}>Show {status.category === "Income" ? 'Expense' : "Income"}<ion-icon name="chevron-forward-outline"></ion-icon></span>

                    </section>
                    <section>
                        {status.category === 'Income' ? <IncomeRecords data={monthlyIncome} /> : <ExpenseRecord data={monthlyExpense} />}
                    </section>
                </article>
            </div>
            <NavBar />
        </>
    )
}

function ExpenseRecord({ data }) {
    return (
        <>
            <div>
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
            </div>
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
