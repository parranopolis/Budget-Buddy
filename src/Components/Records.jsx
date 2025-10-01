import { useContext, useEffect, useState, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import PropTypes from 'prop-types'
import { doc, deleteDoc } from 'firebase/firestore'

import { monthlyCollectionContext } from "../Context/ExpensesContext"
import { MonthlyIncomeContext } from "../Context/IncomeContext"
import './../Styles/components/Records.css'
import { NavBar, TopNavBar } from "./NavBar"
import { db } from "../../services/firebaseConfig"
// import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart } from "chart.js/auto";
import { DoughnutChart } from "./Activity"

// import ChartDataLabels from 'chartjs-plugin-datalabels';

export function TotalSum({ title, collectionRef, date = 'test' }) {
    const { monthlyIncome } = useContext(MonthlyIncomeContext)
    const { monthlyExpense } = useContext(monthlyCollectionContext)
    const [totalAmount, setTotalAmount] = useState(0)

    // const calcTotal = (collectionName) => {
    //     const total = collectionName.reduce((sum, entry) => {
    //         return sum + (typeof entry.amount === 'string' ? parseFloat(entry.amount) : entry.amount)

    //     }, 0)
    //     return total.toFixed(2)
    // }
    useEffect(() => {
        let total = 0
        if (collectionRef === 'monthlyIncome') {
            total = monthlyIncome
                .filter((element) => element.date === date)
                .reduce((acc, element) => acc + parseFloat(element.amount), 0);
        } else if (collectionRef === 'monthlyExpenses') {
            total = monthlyExpense
                .filter((element) => element.date === date)
                .reduce((acc, element) => acc + parseFloat(element.amount), 0);
        }
        setTotalAmount(total)
    }, [monthlyExpense, monthlyIncome, collectionRef])
    return (
        <>
        <article className="bg-white flex rounded-2xl p-8 justify-between items-center">
            <div className="flex flex-col">
                <span className="text-base font-extralight">Today {title}</span>
                <span className="text-3xl font-light">$ {totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex flex-col text-center w-28">
                <span className="text-3xl bg-accent text-white rounded-md">↑83%</span>
                <span className="font-extralight text-sm">Last Tuesday</span>
                {/* ↓ */}
            </div>
        </article>
            {/* <section className="box">
                <div className="h6">Total {title}</div>
                <div className="h2 totalAmount">${totalAmount}</div>
            </section> */}
        </>
    )
}

export function Transactions({ date }) {
    const { monthlyExpense } = useContext(monthlyCollectionContext)
    const { monthlyIncome } = useContext(MonthlyIncomeContext)

    const [state, setState] = useState({
        date: '',
        transaction: [],
        category: 'Expense'
    })
    const [element, setElement] = useState([])

    useEffect(() => {
        const data = state.category === 'Expense' ? monthlyExpense : monthlyIncome
        let filterElement = []
        data.forEach(element => {
            if (element.date === date) {
                filterElement.push(element)
            }
        });

        setElement(filterElement)
        let q = new Date()

        setState(prevState => ({
            ...prevState,
            date: q.toDateString(),
            transaction: filterElement
        }))

    }, [monthlyExpense, monthlyIncome, state.category, setElement])

    const handleShowCategory = (e) => {
        setState(prevState => ({
            ...prevState,
            category: prevState.category === 'Expense' ? 'Income' : 'Expense'
        }))
    }
    return (
        <>
                <article>
                    {/* <span className="h3">{state.date}</span> */}
                    <hr className="my-4 text-gray-300" />
                    <span className='text-3xl font-bold'>Activity</span>
                    {/* <span className='h4'>Resent Activity: {state.category === 'Income' ? "Income" : 'Expense'} </span> */}
                    {/* of {state.month}</span> */}
                    {/* <span onClick={handleShowCategory} className="h6" style={{ color: '#f36c9c' }}>Show {state.category === "Income" ? 'Expense' : "Income"}<ion-icon name="chevron-forward-outline"></ion-icon></span> */}
                </article>
                <article className="flex flex-col gap-8 mt-8">
                {state.transaction.map((item) => {
                    return (
                        <Link key={item.id} to={`./MerchanDetail/${item.store}`} state={{ store: item.store }}> {/* Merchan detail */}
                            <article className="text-black flex items-center justify-between gap-4 border-2 rounded-3xl p-6">
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    {/* Avatar / icono */}
                                    <div className="bg-highlight rounded-full w-16 h-16 shrink-0" />
                                    {/* Texto */}
                                    <div className="flex flex-col min-w-0">
                                    <span className="text-base font-medium truncate">
                                        {state.category === 'Income' ? item.from : item.store}
                                    </span>
                                    <span className="text-base font-extralight truncate">{item.date}</span>
                                    </div>
                                </div>
                                {/* Importe */}
                                <div className="text-right shrink-0">
                                    <span className="text-xl font-medium">$ {item.amount}</span>
                                </div>
                            </article>
                        </Link>
                    )
                })}
                </article>
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
        // console.log(merchanDataList)
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
                            // <Link key={item.id} to={'/transactionDetail'}>
                            <section key={item.id} className="transactionHistory">
                                <div className="itemA">
                                    <div className=" h6">{item.field}</div>
                                    <div className=" p-large">{item.date}</div>
                                </div>
                                <div className="itemB">
                                    <div className="h4 price">$ {item.amount}</div>
                                    <div className="itemB-Actions">
                                        <Actions item={item} />
                                    </div>
                                </div>
                            </section>
                            // </Link>
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
// monthlyExpenses
function Actions({ item }) {
    const onDelete = async (e) => {
        // const q = await doc(db, 'id', item.id)
        const w = doc(db, 'monthlyExpenses', item.id)
        const q = await deleteDoc(w)
        // console.log(q.data())
    }
    return (
        <>
            <span>{item.id}</span>
            <span className="h5"><ion-icon name="document-text-outline"></ion-icon></span>
            <span onClick={onDelete} className="h5"><ion-icon name="trash-outline"></ion-icon></span>
            <Link to={'/transactionDetail'}>
                <span className="h5"><ion-icon name="chevron-forward-outline"></ion-icon></span>
            </Link>
        </>
    )
}

// export function DateRange() {
//     return(
//         <>
//             <section className="">
//                 <article className="border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full text-center">
//                     <span className="text-2xl font-extralight">Jul 01 - Jul 07 2025</span>
//                 </article>            
                
//             </section>
//         </>
//     )
// }

//Crear el componente de rango de fecha. Ademas del formato ->  1w,1M,6M,1Y,5Y se debe poder seleccionar el rango de manera custom.
//   <article className="border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full flex justify-between text-2xl font-extralight">
//                         <span className="isActive">1W</span>
//                         <span>1M</span>
//                         <span>6M</span>
//                         <span>1Y</span>
//                         <span>5Y</span>
//                     </article>

//Reusarlo en "/reports" y en "/movementHistory"

AnalyzedData.propTypes = {
    expense : PropTypes.array
}

// Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);


export function AnalyzedData ({expense}){
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(()=> {

        if (!expense || expense.length === 0) return; // corta aquí si aún no hay datos

        // total de todos los gastos
        const total = expense.reduce((acc, e) => acc + (e.amount || 0), 0);

        // agrupamos por categoría
        const map = new Map();
        for (const e of expense) {
            const cat = e?.field?.trim();
            if (!cat) continue;
            const current = map.get(cat) || 0;
            map.set(cat, current + (e.amount || 0));
        }

         // convertimos en array con porcentaje
        const stats = Array.from(map.entries()).map(([cat, sum]) => ({
            category: cat,
            amount: sum,
            percentage: total > 0 ? ((sum / total) * 100).toFixed(1) : 0,
        }));    
        setCategoryStats(stats);
    },[expense])
    return(
        <>
        <section className="">
            <article className="text-8xl">
                {/* <ion-icon name="stats-chart-outline"></ion-icon> */}
                <DoughnutChart dataSet={categoryStats}/>
            </article>
            {/* <article className="
            grid grid-rows-3 grid-flow-col
            auto-cols-[minmax(8rem,1fr)] 
            gap-2
            h-27                            
            w-full max-w-full
            overflow-y-auto overflow-x-auto 
            p-2
            items-center
            ">
            {categoryStats.length === 0 ? (
                <span>No hay datos</span>
                ) : (
                categoryStats.map(stat => (
                    <span key={stat.category}>
                    {stat.percentage}% {stat.category}
                    </span>
                ))
            )}
            </article> */}
        </section>

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

// console.log(filterElement)
// const filteredData = data.filter(entry => { // Modified this to filter throw a prop array of object
//     if (entry.date) {
//         const entryDate = new Date(entry.date)
//         const entryMonth = entryDate.getMonth()
//         const entryYear = entryDate.getFullYear()

//         return entryMonth === currentMonth && entryYear === currentYear
//     }
//     return false
// })