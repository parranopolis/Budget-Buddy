import { NavBarTest } from "../Components/NavBar";
import { AnalyzedData } from "../Components/Records";
import { TimeFrames } from "../Logic/functions";
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
        period: '1W',
        totalThisPeriod: 0
    })

     useEffect(() => {
            // todos los datos separados por categoria "Expense/Income" extraidos de los contextos respectivos
            const data = status.category === 'Expense' ? monthlyExpense : monthlyIncome
             if (!data || data.length === 0) return; // corta aquí si aún no hay datos
            // usa los datos de data para filtrar por el critero seleccionado en status.period, por defecto esta en W, y toma otros 2 campos validos como M y Y
            // const input = filterDataBy([data, status.category, currentMonth, currentYear, status.period])
            // const q = 
            
            const filteredData = FilterByCriteria(data, status.period)

            setStatus(prevStatus => ({
                ...prevStatus,
                map: filteredData,
                // totalThisPeriod: TotalSum2(input)
            }))
        }, [monthlyExpense, monthlyIncome, status.category, status.period])
        
        
    const handleTimeFrame = useCallback((frame) => {
        setStatus((s) => ({...s,period:frame}))
    },[])

    return(
    //   <section className="bg-main py-8 px-8 flex flex-col gap-8 shadow"><section/>
    <>
        <main className="m-8">
            <h3 className='text-3xl font-medium pb-8'>Analysis</h3>
            <section className="flex flex-col gap-8 mt-4">
            <TimeFrames onChange={handleTimeFrame}/>
                <article className="w-full bg-[rgba(129_230_217_/_0.43)] h-42 rounded-2xl px-4 pt-2">
                                                {/* <div className="w-full px-4"><canvas id="acquisitions"></canvas></div> */}
                                                {/* <ChartActivity/> */}
                </article>
                <AnalyzedData/>
                <article className="flex flex-col gap-4 text-xl font-extralight">
                    <div className="flex justify-between">
                        <span>Ganado:</span><span>$ 3293,17</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Gastado:</span>
                        <span>$ 2123,87</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Restante:</span><span>$ 1169,30</span>
                    </div>
                </article>
                {/* Este deberia estar completamente al fondo, justo arriba de la barra de navegacion */}
                <article className="">
                    En este Periodo Gastaste 30% de tu ingreso neto
                </article>
            </section>
            
        </main>
        <aside>
                <NavBarTest/>
        </aside>
    </>
    )
}