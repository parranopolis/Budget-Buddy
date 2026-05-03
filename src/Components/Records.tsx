import { useContext, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import PropTypes from 'prop-types'
import { where,query, collection, getDocs } from 'firebase/firestore'
import './../Styles/components/Records.css'
import { db } from "../services/firebaseConfig.ts"
import { DoughnutChart } from "./Activity.tsx"
import { useUserContext } from "../Context/Context.tsx"
import { categories, type Category } from "../Logic/categories.ts"
import { type ExpenseItem, type TransactionItem } from "../Context/ExpensesContext.tsx"

interface TotalSumProps {
    title: string,
    collectionRef: string,
    data: TransactionItem[]
}

interface CompareLastWeekType{
    percetage:string,
    day:string | undefined,
    signal:string
}

export function TotalSum({ title, collectionRef, data }: TotalSumProps) {
    const { userId } = useUserContext()
    
    const [totalAmount, setTotalAmount] = useState<number>(0)
    const d = new Date();
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day = weekday[d.getDay()];
    
    const [compareLastWeek,setCompareLastWeek] = useState<CompareLastWeekType>({
        percetage: '0',
        day:day,
        signal:''
    })
    useEffect(() => {
        if(data.length === 0 && !userId) return
        const test = async() => {
            let totalToday = 0
            let totalSameDayLastWeek = 0
            const colRef = collection(db,'newMonthlyExpenses',userId as string, 'expenses')

            const qRange = query(
                colRef,
                where("date", "==", lastWeekSameWeekdayKey()),
            )
            
            const snap = await getDocs(qRange)
            const p = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            
            data.forEach((element) => totalToday = totalToday + element.amount);
            (p as TransactionItem[]).forEach((element) => totalSameDayLastWeek = totalSameDayLastWeek + (element.amount))

            // (v1 - v2) / v2 * 100 = % de cambio entre v1 y v2. 
            // Si el resultado es positivo, v1 es mayor que v2; 
            // si es negativo, v1 es menor que v2; y si es cero, ambos valores son iguales.
            let rPercentDifference = 0
            if(totalSameDayLastWeek === 0 || totalToday === 0){
                rPercentDifference = 100
            }else{
                rPercentDifference = ((totalToday - totalSameDayLastWeek) / totalSameDayLastWeek) * 100
            }
            
            setCompareLastWeek(prev =>{
                const absoluteDiff = Math.abs(rPercentDifference)
                let finalPercentage : string
                if(rPercentDifference === 0 ) {
                    finalPercentage = "Same"
                } else {
                    finalPercentage = absoluteDiff.toFixed(2)
                }
                return {
                    ...prev,
                    percetage : finalPercentage,
                    signal : rPercentDifference > 0 ? "↑" : rPercentDifference < 0 ?"↓" : "",
                }
            })
            setTotalAmount(totalToday)
        }
        test()
    }, [data,collectionRef,userId])
    
    return (
        <>
            <article className="bg-white flex rounded-2xl p-8 justify-between items-center">
                <div className="flex flex-col gap-2">
                    <span className="text-base font-extralight">Today {title}</span>
                    <span className="text-3xl font-light">$ {totalAmount}</span>
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
        return `${y}-${m}-${day}`; // "YYYY-MM-DD"`
}

// hacer el loader, la foto de la cateogria, y la pagina de error.

interface FilterCategory{
    activeCategories: string[],
    activeCategoryFilterData: string[],
    showModa: boolean
}

interface TransactionsProps {
    data: TransactionItem[],
    collectionRef: string,
    filterCategory: FilterCategory
}


export function Transactions({ data, collectionRef, filterCategory }: TransactionsProps) {
    

    const [state, setState] = useState({
        date: new Date().toDateString(),
        transaction: [] as TransactionItem[],
        category: collectionRef
    })
    const q = useMemo(()=>{
        
        if(data.length === 0) return []
        if(filterCategory.activeCategories.length === 0) return data
        console.log(data)
        return data.filter((item) => 
            item.field ? filterCategory.activeCategories.includes(item.field): false)
    },[data,filterCategory.activeCategories])

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            transaction: q,
            category: collectionRef
        }))

    }, [q, collectionRef])
    
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
                            <span>${state.transaction.reduce((acc, item) => acc + item.amount, 0).toFixed(2)}</span>
                        </div>
                    )}
                </article>
                <article className="flex flex-col gap-8 mt-6">
                    {state.transaction?.map((item) => {
                        let categoryInfo = categories?.find((cat:Category) => cat.name === item.field)
                        if(categoryInfo === undefined) categoryInfo = { name: "Income", icon: "💰", color: "#2f855a" } // Income
                        return (
                            <Link key={item.id} to={`/transactionDetail/${collectionRef}/${item.id}`} state={item}> {/* Merchan detail */}
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

interface AnalyzedDataProps {
    expense: ExpenseItem[];
}
interface CategoryStats{
    category: string;
    amount: number;
    percentage: string;
}
export function AnalyzedData ({expense}: AnalyzedDataProps){
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);

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
            percentage: total > 0 ? ((sum / total) * 100).toFixed(1) : "0",
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
