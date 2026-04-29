import { useContext, useEffect, useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import PropTypes from 'prop-types'
import { where,query, collection, getDocs } from 'firebase/firestore'
import { monthlyCollectionContext } from "../Context/ExpensesContext.tsx"
import './../Styles/components/Records.css'
import { TopNavBar } from "./NavBar"
import { db } from "../services/firebaseConfig.ts"
import { DoughnutChart } from "./Activity"
import { UserContext } from "../Context/Context.tsx"
import { categories } from "../Logic/categories"

TotalSum.propTypes = {
    title : PropTypes.string,
    collectionRef: PropTypes.string,
    data: PropTypes.array,
}

export function TotalSum({ title, collectionRef, data }) {
    const { userId } = useContext(UserContext)
    const [totalAmount, setTotalAmount] = useState(0)
    const d = new Date();
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day = weekday[d.getDay()];
    
    const [compareLastWeek,setCompareLastWeek] = useState({
        percetage: '0',
        day:day,
        signal:''
    })
    useEffect(() => {
        setTotalAmount(0)
        if(data.length === 0) return
        const test = async() => {
            let totalToday = 0
            let totalSameDayLastWeek = 0
            const colRef = collection(db,'newMonthlyExpenses',userId, 'expenses')

            const qRange = query(
                colRef,
                where("date", "==", lastWeekSameWeekdayKey()),
            )
            
            const snap = await getDocs(qRange)
            const p = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            
            data.forEach((element) => totalToday = totalToday + parseFloat(element.amount))
            p.forEach((element) => totalSameDayLastWeek = totalSameDayLastWeek + (element.amount))
            // (v1 - v2) / v2 * 100 = % de cambio entre v1 y v2. 
            // Si el resultado es positivo, v1 es mayor que v2; 
            // si es negativo, v1 es menor que v2; y si es cero, ambos valores son iguales.
            let rPercentDifference = 0
            if(totalSameDayLastWeek === 0 || totalToday === 0){
                rPercentDifference = 100
            }else{
                rPercentDifference = ((totalToday - totalSameDayLastWeek) / totalSameDayLastWeek) * 100
            }
            
            setCompareLastWeek(prev =>({
                ...prev,
                percetage : rPercentDifference < 0 ? rPercentDifference.toFixed(2) * (-1) : rPercentDifference.toFixed(2) > 0 ? rPercentDifference.toFixed(2) : "Same",
                signal : rPercentDifference > 0 ? "↑" : rPercentDifference < 0 ?"↓" : "",
            }))
            setTotalAmount(totalToday)
        }
        test()
    }, [data,collectionRef,userId])
    
    return (
        <>
            <article className="bg-white flex rounded-2xl p-8 justify-between items-center">
                <div className="flex flex-col gap-2">
                    <span className="text-base font-extralight">Today {title}</span>
                    <span className="text-3xl font-light">$ {totalAmount.toFixed(2)}</span>
                </div>
                {collectionRef === "Expenses" ? (
                    <div className="flex flex-col text-center w-30 md:w-40 gap-2">
                    {/* ↑ */}
                    <span className="text-2xl md:text-3xl bg-accent text-white rounded-md">{compareLastWeek.signal}{compareLastWeek.percetage}%</span>
                    <span className="font-extralight text-sm">Last {compareLastWeek.day}</span>
                    {/* ↓ */}
                </div>
                ) : ""}
            </article>
        </>
    )
}


function lastWeekSameWeekdayKey(today = new Date()) {
        // normalize to noon to avoid rare DST issues
        const d = new Date(today);
        d.setHours(12, 0, 0, 0);
        d.setDate(d.getDate() - 7);

        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`; // "YYYY-MM-DD"
    }

Transactions.propTypes = {
    data : PropTypes.array,
    collectionRef: PropTypes.string,
    filterCategory: PropTypes.object
}

// hacer el loader, la foto de la cateogria, y la pagina de error.

export function Transactions({ data, collectionRef, filterCategory }) {
    
    const [state, setState] = useState({
        date: new Date().toDateString(),
        transaction: [],
        category: collectionRef
    })

    const q = useMemo(()=>{
        
        if(data.length === 0) return []
            
        if(filterCategory.activeCategories.length === 0) return data
        // console.log(filterCategory.categoryFilterData)
        return data.filter((item)=> filterCategory.activeCategories.includes(item.field))
    },[data,filterCategory.activeCategories])

    useEffect(() => {
        if(q.length === 0) return
        setState(prevState => ({
            ...prevState,
            transaction: q.length === 0 ?data : q,
            category: collectionRef
        }))

    }, [data,collectionRef,state.transaction,q])
    
    return (
        <>
        {state.transaction.length === 0 ? <span className='text-3xl font-bold'>No Activity</span> : (<>
            <article>
                    <hr className="my-4 text-gray-300" />
                    <span className='text-3xl font-bold'>Activity</span>
                    {location.pathname === "/" ? "" : (
                        <div className="flex justify-around text-xl mt-4">
                            <span>Transaccions: </span>
                            <span>{state.transaction.length}</span>
                            <span>Total: </span>
                            <span>${state.transaction.reduce((acc, item) => acc + parseFloat(item.amount), 0).toFixed(2)}</span>
                        </div>
                    )}
                </article>
                <article className="flex flex-col gap-8 mt-6">
                    {state.transaction?.map((item) => {
                        let categoryInfo = categories?.find(cat => cat.name === item.field)
                        if(categoryInfo === undefined) categoryInfo = { name: "Income", icon: "💰", color: "#2f855a" } // Income
                        return (
                            <Link key={item.id} to={`/transactionDetail/${collectionRef}/${item.id}`} state={item} amount={item}> {/* Merchan detail */}
                                <article className="text-black flex items-center justify-between gap-4 border-2 rounded-3xl p-6">
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        {/* Avatar / icono */}
                                        <div className={`rounded-full w-16 h-16 shrink-0 flex justify-center items-center`} style={{backgroundColor: categoryInfo.color}}>
                                            <span className="">
                                                {categoryInfo.icon}
                                            </span>
                                        </div>
                                        {/* Texto */}
                                        <div className="flex flex-col min-w-0">
                                        <span className="text-base font-medium truncate">
                                            {collectionRef === 'Expenses' ? item.store: item.from}
                                            {/* {item.store} */}
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

AnalyzedData.propTypes = {
    expense : PropTypes.array
}

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
        </section>

        </>
    )
}
