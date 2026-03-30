import { Link } from "react-router-dom"
import { useCallback,useContext, useEffect, useMemo, useState } from "react"
import {PropTypes } from 'prop-types'
import { monthlyCollectionContext } from "../Context/ExpensesContext"
// import { TimeContext } from "../Context/Context"
// import Chart from 'chart.js/auto'
// import ChartActivity from "../Components/Activity"

import {NavBarTest} from "../Components/NavBar"

import { TimeFrames } from "../Logic/functions"

import './../Styles/pages/MovementsHistory.css'
import { Transactions } from "../Components/Records"

export function Activity() {
    const { monthlyExpense, exampleValue, categoryRef, setCategoryRef } = useContext(monthlyCollectionContext)
    const [status, setStatus] = useState({
            category: categoryRef,
            map: [],  // mapa de datos filtrados listos para la UI
            period: '1W',
            totalThisPeriod: 0
        })
    const [filterModal, setFilterModal] = useState({
        showModal: false,
        categoryFilterData: [],
        activeCategories:[]
    })
    // Cambia entre categorias
    const handleShowCategory = () => {
        const nextCategory = categoryRef === 'Expenses' ? 'Income' : 'Expenses'
        setStatus(prevStatus => ({
            ...prevStatus,
            category: nextCategory
        }))
        setCategoryRef(nextCategory)
    }

    const handleTimeFrame = useCallback((frame) => {
        setStatus((s) => ({...s,period:frame}))
        // exampleValue.setFilter(frame)
    },[])

    // const [activeFilters, setActiveFilters ] = useState([])

   useEffect(()=>{
        
    exampleValue.setFilter(status.period)
   },[exampleValue,status.period,setCategoryRef,status.category])


   useMemo(() => {
    const categoryFiltered = [...new Set(monthlyExpense.map( item => item.field))]
    setFilterModal(prev => ({...prev, categoryFilterData: categoryFiltered}))
   },[monthlyExpense])
    
    const handleFilterChange = (e) =>{
        const {value, checked} = e.target
        setFilterModal((prev) => {
    if (checked) {
      // Si está marcado, lo agregamos al array de checkboxes
      return {
        ...prev,
        activeCategories: [...prev.activeCategories, value]
      };
    } else {
      // Si se desmarca, filtramos para quitar ese valor
      return {
        ...prev,
        activeCategories: prev.activeCategories.filter((item) => item !== value)
      };
    }
  });
    };
    return (
        <>
        <main className="mx-8 my-8">
                <h1 className='text-3xl font-medium'>Movement History</h1>
                <section className="flex flex-col gap-8 mt-4">
                    {/* <article className="border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full flex justify-between items-center">
                        <span className="text-3xl">←</span><span className
                        ="text-2xl font-extralight">Today</span><span className="text-3xl">→</span>
                    </article> */}
                  
                    {/* Tienes que sacar el rango de tiempo y en base a eso hacer el fetching de datos. */}
                    {/* osea devolver un rango de fecha para usarlo luego. */}
                    {/* usa un callback para traer los rangos de las fechas. */}
                    <TimeFrames onChange={handleTimeFrame} activeTimeFrame={status.period}/>
                    
                    {/* Charts  activar cuando tengas los datos completos. */}
                    {/* <article className="w-full bg-[rgba(129_230_217_/_0.43)] h-42 rounded-2xl px-4 pt-2"> */}
                     {/* <div className="w-full px-4"><canvas id="acquisitions"></canvas></div> */}
                        {/* <ChartActivity/> */}
                    {/* </article> */}
                        {/* Filters Button */}
                    {categoryRef === "Expenses" ?  <article className="border-Cborder border bg-bg-form px-4 py-2 w-full rounded-lg" >
                        <h2 className="text-center text-2xl font-semibold" onClick={() => setFilterModal({...filterModal, showModal: !filterModal.showModal, activeCategories: []})}>Filters</h2>
                        {filterModal.showModal == false ? "" : 
                            <div className="w-full px-4 py-4">
                                <form action="" className="flex flex-col gap-4">
                                <h3 className="text-lg underline italic font-medium">Categories</h3>
                                <div className="grid grid-cols-2 gap-2 py-4">
                                    {filterModal.categoryFilterData.map((category) =>(
                                    <label htmlFor="" key={category}>
                                        <input type='checkbox' name='category' value={category} onChange={handleFilterChange} /> {category}
                                    </label>
                                    ))}
                                </div>
                                </form>
                            </div>
                        }
                        </article> :""}
                    
                </section>
                <section className="mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-3xl">{categoryRef}</span>
                        <span onClick={handleShowCategory} className="p-large right" style={{ color: '#f36c9c' }}>Show {status.category === "Income" ? 'Expenses' : "Income"}<ion-icon name="chevron-forward-outline"></ion-icon></span>
                    </div>
                    {/* <DataList data={status.map} category={status.category}></DataList> */}
                    <Transactions data={monthlyExpense} collectionRef={categoryRef} filterCategory={filterModal}/>
                </section>
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