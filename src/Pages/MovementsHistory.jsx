import { Link } from "react-router-dom"
import { useCallback,useContext, useEffect, useMemo, useState } from "react"
import {PropTypes } from 'prop-types'
import { monthlyCollectionContext } from "../Context/ExpensesContext"
import { TimeContext } from "../Context/Context"
import { MonthlyIncomeContext } from "../Context/IncomeContext"
// import Chart from 'chart.js/auto'
import ChartActivity from "../Components/Activity"

import {NavBarTest} from "../Components/NavBar"

import { FilterByCriteria, TimeFrames, TotalSum2 } from "../Logic/functions"

import './../Styles/pages/MovementsHistory.css'

export function Activity() {

    const { monthlyIncome } = useContext(MonthlyIncomeContext)
    const { monthlyExpense } = useContext(monthlyCollectionContext)
    const { currentMonth, currentYear, currentMonthName } = useContext(TimeContext)

    // console.log(currentMonth, currentMonthName, currentYear)
    const [status, setStatus] = useState({
            category: 'Expense',
            map: [],                // mapa de datos filtrados listos para la UI
            period: '1W',
            totalThisPeriod: 0
        })

    // Cambia entre categorias
    const handleShowCategory = () => {
        setStatus(prevStatus => ({
            ...prevStatus,
            category: prevStatus.category === 'Expense' ? 'Income' : "Expense",
        }))
    }

//Eleminar el console.log en Movement.jsx 95
    useEffect(() => {
        // todos los datos separados por categoria "Expense/Income" extraidos de los contextos respectivos
        const data = status.category === 'Expense' ? monthlyExpense : monthlyIncome
         if (!data || data.length === 0) return; // corta aquí si aún no hay datos
        // usa los datos de data para filtrar por el critero seleccionado en status.period, por defecto esta en W, y toma otros 2 campos validos como M y Y
        // const input = filterDataBy([data, status.category, currentMonth, currentYear, status.period])
        // const q = 
        // console.log(status.period)

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


    // Mover a otros componentes  --->



    // async function chart() {
    //     const data = [
    //     { year: 2010, count: 10 },
    //     { year: 2011, count: 20 },
    //     { year: 2012, count: 15 },
    //     { year: 2013, count: 25 },
    //     { year: 2014, count: 22 },
    //     { year: 2015, count: 30 },
    //     { year: 2016, count: 28 },
    //     ];

    //     new Chart(
    //         document.getElementById('acquisitions'),
    //         {
    //             type: 'bar',
    //             data: {
    //             labels: data.map(row => row.year),
    //             datasets: [
    //                 {
    //                 label: 'Acquisitions by year',
    //                 data: data.map(row => row.count)
    //                 }
    //             ]
    //             }
    //         }
    //     );    
    // }

    

// chart()
//aqui esta el problema -> <TopNavBar title={'Records'} />
    return (
        <>
        <main className="mx-8 my-8">
                <h1 className='text-3xl font-medium'>Movement History</h1>
                <section className="flex flex-col gap-8 mt-4">
                    {/* <article className="border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full flex justify-between items-center">
                        <span className="text-3xl">←</span><span className="text-2xl font-extralight">Today</span><span className="text-3xl">→</span>
                    </article> */}
                  
                    {/* Tienes que sacar el rango de tiempo y en base a eso hacer el fetching de datos. */}
                    {/* osea devolver un rango de fecha para usarlo luego. */}
                    {/* usa un callback para traer los rangos de las fechas. */}
                    <TimeFrames onChange={handleTimeFrame}/>
                    
                    {/* Charts */}
                    <article className="w-full bg-[rgba(129_230_217_/_0.43)] h-42 rounded-2xl px-4 pt-2">
                        {/* <div className="w-full px-4"><canvas id="acquisitions"></canvas></div> */}
                        <ChartActivity/>
                    </article>
                    <article className="flex justify-between gap-4">
                        {/* hamburger menu */}
                        <div className="w-8 flex flex-col gap-2 my-auto ml-2">
                            <div className="p-0 m-0 border"></div>
                            <div className="p-0 m-0 border"></div>
                            <div className="p-0 m-0 border"></div>
                        </div>
                        {/* Filters Button */}
                        <div className="border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full text-center">
                            Filters
                        </div>
                    </article>
                {/*     filtro de semana, mes, año  */}
                {/* <section>
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
                            <span className="h3">{currentMonth} {currentYear}</span>
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
                        </div>
                    </section>  */}
                </section>
                <section className="mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-3xl">{status.category}</span>
                        <span onClick={handleShowCategory} className="p-large right" style={{ color: '#f36c9c' }}>Show {status.category === "Income" ? 'Expense' : "Income"}<ion-icon name="chevron-forward-outline"></ion-icon></span>
                    </div>
                    <DataList data={status.map} category={status.category}></DataList>
                </section>
            {/* <NavBar /> */}
        </main>
        <aside>
            <NavBarTest />
        </aside>
          {/* <!-- <div style="width: 500px;"><canvas id="dimensions"></canvas></div><br/> --> */}

    {/* <!-- <script type="module" src="dimensions.js"></script> --> */}
            {/* <script type="module" src="acquisitions.js"></script> */}
        </>
    )
}
DataList.propTypes = {
      data: PropTypes.array.isRequired,
      category: PropTypes.string,
    };


function DataList( {data, category} ) {
    return (
        <>
            <article className="flex flex-col gap-4 mt-8">
                {Array.isArray(data) && data.length != 0 ? (
                    data.map( data => (
                            <Link key={data.id} to={`/MerchanDetail/${data.store}`} state={{ store: data.store }}> {/* Merchan detail */}
                                <article className="text-black flex items-center justify-between gap-4 border-2 rounded-3xl p-6">
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                            {/* Avatar / icono */}
                                            <div className="bg-category rounded-full w-16 h-16 shrink-0" />
                                            {/* Texto */}
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-base font-medium truncate">
                                                    {category === 'Income' ? data.from : data.store}
                                                </span>
                                            <span className="text-base font-extralight truncate">{data.date}</span>
                                            </div>
                                        </div>
                                        {/* Importe */}
                                        <div className="text-right shrink-0">
                                            <span className="text-xl font-medium">$ {data.amount}</span>
                                        </div>
                                </article>
                            </Link>
                        )
                    )) : (<h4>No data To Show</h4>)
                }
            </article>
        </>
    )
}
// commented to find the issue
// function ExpenseRecord({ data }) {
//     return (
//         <>
//             {data != 0 ? data.map((data, index) => {
//                 return (
//                     <div key={index}>
//                         <div className="h4">{data.store}</div>
//                         <div className="h5">${data.amount}</div>
//                         <div className="p-large">{data.field}</div>
//                         <div className="p-large">{data.date}</div>
//                         <div className="p-large">{data.payMethod}</div>
//                         <div className="p-large">{data.uid}</div>
//                         <hr />
//                     </div>
//                 )
//             }) : <h4>Nothing here</h4>}
//         </>
//     )
// }

// function IncomeRecords({ data }) {
//     return (
//         <>
//             <div>
//                 {data != 0 ? data.map(item => {
//                     return (
//                         <div key={item.id}>
//                             <div>{item.from}</div>
//                             <div>{item.date}</div>
//                             <div>{item.id}</div>
//                             <div>{item.amount}</div>
//                             <hr />
//                         </div>
//                     )
//                 }) : <span>no data</span>}
//             </div>
//         </>
//     )
// }




// EXAMPLE 1
// Input:[
//   {userId: 'U1', timestamp: 2, content: 'Hello'},
//   {userId: 'U2', timestamp: 3, content: 'Hi'},
//   {userId: 'U1', timestamp: 6, content: 'How are you'},
//   {userId: 'U1', timestamp: 4, content: 'Hey'}
// ]
// Output:[
//   {userId: 'U2', timestamp: 3, content: 'Hi'},
//   {userId: 'U1', timestamp: 6, content: 'How are you'}
// ]
// Explanation:Messages from U1 at timestamps 2 and 4 are within 5 seconds, so only the latest (timestamp 4) is kept. Then, that message is also within 5 seconds of the message at timestamp 6, so only the message at 6 remains. U2's message is preserved as it's from a different user.
// EXAMPLE 2
// Input:[
//   {userId: 'U1', timestamp: 1, content: 'Hello'},
//   {userId: 'U1', timestamp: 10, content: 'World'},
//   {userId: 'U2', timestamp: 2, content: 'Hi'}
// ]
// Output:[
//   {userId: 'U1', timestamp: 1, content: 'Hello'},
//   {userId: 'U2', timestamp: 2, content: 'Hi'},
//   {userId: 'U1', timestamp: 10, content: 'World'}
// ]
// Explanation:All messages are kept because U1's messages are more than 5 seconds apart, and U2's message is from a different user.
// Requirements
// 1
// Input will be an array of message objects, each containing userId (string), timestamp (integer), and content (string)
// 2
// Messages from the same user within 5 seconds should be consolidated, keeping only the latest one
// 3
// Output should be chronologically sorted messages after applying the quiet period rule
// 4
// Preserve messages from different users even if they fall within the same time window
// 5
// Handle empty input gracefully
// 6
// Maintain time complexity of O(n log n) or better





    // const today = new Date()

    // // calcula el domingo de la semana actual
    // const currentDay = today.getDay()
    // const sundayOfCurrentWeek = new Date(today)
    // sundayOfCurrentWeek.setDate(today.getDate() - currentDay)

    // // calcula el sabado de la semana actual
    // const saturdayOfCurrentWeek = new Date(sundayOfCurrentWeek)
    // saturdayOfCurrentWeek.setDate(sundayOfCurrentWeek.getDate() + 6)

    // const q = `${today.toLocaleString('en-US', { month: 'short' })} ${sundayOfCurrentWeek.toLocaleDateString('en-US', { day: '2-digit' })} - ${saturdayOfCurrentWeek.toLocaleDateString('en-US', { day: 'numeric' })}`
            