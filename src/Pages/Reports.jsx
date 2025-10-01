import { NavBarTest } from "../Components/NavBar";
import { AnalyzedData } from "../Components/Records";
import { TimeFrames, TotalSum2 } from "../Logic/functions";
import { useState, useCallback,useEffect,useContext } from "react";
import { FilterByCriteria } from "../Logic/functions";
import { MonthlyIncomeContext } from "../Context/IncomeContext";
import { monthlyCollectionContext } from "../Context/ExpensesContext";

export function Reports (){
    const { monthlyIncome } = useContext(MonthlyIncomeContext)
    const { monthlyExpense } = useContext(monthlyCollectionContext)
    const [status, setStatus] = useState({
        category: 'Expense',
        map: [],                // mapa de datos filtrados listos para la UI
        period: '1M',
        incomeTotalPeriod: 0,
        expenseTotalPeriod: 0,
        totalThisPeriod: 0,
        categories: []
    })
    const [q, setQ] = useState([])
     useEffect(() => {
            // todos los datos separados por categoria "Expense/Income" extraidos de los contextos respectivos
            const data = status.category === 'Expense' ? monthlyExpense : monthlyIncome
             if (!data || data.length === 0) return; // corta aquí si aún no hay datos
            // usa los datos de data para filtrar por el critero seleccionado en status.period, por defecto esta en W, y toma otros 2 campos validos como M y Y
            // const input = filterDataBy([data, status.category, currentMonth, currentYear, status.period])
            // const q = 
            
            const expense = FilterByCriteria(monthlyExpense, status.period)
            const income = FilterByCriteria(monthlyIncome, status.period)
            setQ(expense)
            const categories = Array.from(
            new Set(
                expense
                .map(e => e?.field?.trim())
                .filter(Boolean)
            )
            );
            setStatus(prevStatus => ({
                ...prevStatus,
                map: [expense,income],
                incomeTotalPeriod: TotalSum2(income),
                expenseTotalPeriod: TotalSum2(expense),
                categories : categories
                // (gastado / ganado) * 100

            }))
        }, [monthlyExpense, monthlyIncome, status.category, status.period])
        
        const calcPercentage = (a,b) =>{
            if(a == 0 ){
                return <span className="text-red-700">Percentage on income is not calculated because it was ${a}</span>
            }
            const result = (b/a) * 100
        return <span>You spent {result.toFixed(2)}% of your total income in this period</span>
        }
        
    const handleTimeFrame = useCallback((frame) => {
        setStatus((s) => ({...s,period:frame}))
    },[])

    return(
    //   <section className="bg-main py-8 px-8 flex flex-col gap-8 shadow"><section/>
    <>
        <main className="m-8">
            <h3 className='text-3xl font-medium pb-8'>Analysis</h3>
            <TimeFrames onChange={handleTimeFrame} activeTimeFrame={status.period}/>
            {status.expenseTotalPeriod == 0 && status.incomeTotalPeriod == 0 ? 
            <div className="text-red-700 text-center text-xl font-medium w-full my-8">
                <h2 className="text-2xl">There is no data to display <br/>Please change the search criteria.</h2>
            </div> 
            :
            <section className="flex flex-col gap-8 mt-4">
                {/* <article className="w-full bg-[rgba(129_230_217_/_0.43)] h-42 rounded-2xl px-4 pt-2">
                    {/* <div className="w-full px-4"><canvas id="acquisitions"></canvas></div> */}
                    {/* <ChartActivity/>
                </article> */}
                <article className="flex flex-col gap-4 text-xl font-extralight">
                    <div className="flex justify-between">
                        <span>Income:</span><span>$ {status.incomeTotalPeriod}</span>
                    </div>
                    {status.incomeTotalPeriod == 0 ? 
                    <div className="flex justify-between">
                        <span>Outcome:</span>
                        <span>$ {status.expenseTotalPeriod}</span>
                    </div> : 
                    <>
                        <div className="flex justify-between">
                            <span>Outcome:</span>
                            <span>$ {status.expenseTotalPeriod}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <span>Remaining:</span><span>$ {(status.incomeTotalPeriod - status.expenseTotalPeriod).toFixed(2)}</span>    
                        </div>
                    </>
                    }
                </article>
                {/* Este deberia estar completamente al fondo, justo arriba de la barra de navegacion */}
                <article className="text-center text-xl font-medium">
                    {status.incomeTotalPeriod == 0 && status.expenseTotalPeriod == 0 ? '' : calcPercentage(status.incomeTotalPeriod, status.expenseTotalPeriod) }
                </article>
                <AnalyzedData expense={q}/>

            </section>
                    }
        </main>
        <aside>
                <NavBarTest/>
        </aside>
    </>
    )
}