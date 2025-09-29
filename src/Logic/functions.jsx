import { useState } from 'react'
import '../Styles/main.css'
import PropTypes from 'prop-types'

/**
 * Filtra un conjunto de datos según el periodo indicado en `data[4]`.
 *
 * Reglas:
 * - 'W' → filtra por semana (`filterDataByWeek`)
 * - 'M' → filtra por mes (`filterDataByMonth`)
 * - 'Y' → filtra por año (`filterDataByYear`)
 *
 * @param {any[]} data - Arreglo donde `data[4]` contiene el periodo: 'W' | 'M' | 'Y'.
 * @returns {any} Resultado del filtro correspondiente.
 *
 * @example
 * // data[4] === 'M' → filtra por mes
 * const salida = filterDataBy(['...', '...', '...', '...', 'M']);
 */

export function filterDataBy(data) {
    // console.log(data[4])
    if (data[4] === 'W') {
        return filterDataByWeek(data)
    }
    if (data[4] === 'M') {
        return filterDataByMonth(data)
    }
    if (data[4] === 'Y') {
        return filterDataByYear(data)
    }
}

/////////////////////

// Helpers
const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay   = d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

// Parse "YYYY-MM-DD" (or "YYYY/MM/DD") as LOCAL date (not UTC)
function parseLocalDate(input) {
  if (input instanceof Date) return startOfDay(input);
  if (typeof input === 'string') {
    const [y, m, d] = input.split(/[-/]/).map(Number);
    return new Date(y, (m - 1), d); // local midnight
  }
  // Fallback
  const d2 = new Date(input);
  return startOfDay(d2);
}
const today = new Date()

// calcula el domingo de la semana actual
    const currentDay = today.getDay()
    const sundayOfCurrentWeek = new Date(today)
    sundayOfCurrentWeek.setDate(today.getDate() - currentDay)
    // calcula el sabado de la semana actual
    const saturdayOfCurrentWeek = new Date(sundayOfCurrentWeek)
    saturdayOfCurrentWeek.setDate(sundayOfCurrentWeek.getDate() + 6)

// Normalize your week bounds too
const weekStart = startOfDay(sundayOfCurrentWeek);
const weekEnd   = endOfDay(saturdayOfCurrentWeek);
/////////////////////
// Avoid end-of-month pitfalls (e.g., Mar 31 → Feb 28) by clamping the day
function monthsAgoClamped(baseDate, months) {
  const day = baseDate.getDate();
  const tmp = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  tmp.setMonth(tmp.getMonth() - months);
  const lastDay = new Date(tmp.getFullYear(), tmp.getMonth() + 1, 0).getDate();
  tmp.setDate(Math.min(day, lastDay));
  return tmp;
}
/////

// --- compute "last 6 months" inclusive ---
// Simple (works well for most cases)
const todayEnd = endOfDay(new Date());
const sixMonthsAgoStart = startOfDay(new Date(
  todayEnd.getFullYear(),
  todayEnd.getMonth() - 6,
  todayEnd.getDate()
));

// --- rolling last 12 months (inclusive) ---
const twelveMonthsAgoStart = startOfDay(monthsAgoClamped(todayEnd, 12));

function filterDataByWeek(data) {
    
    const filteredData = data.filter(entry => {
  const entryDate = parseLocalDate(entry.date);
  return entryDate >= weekStart && entryDate <= weekEnd;
});
   
// const today = new Date()

    // // calcula el domingo de la semana actual
    // const currentDay = today.getDay()
    // const sundayOfCurrentWeek = new Date(today)
    // sundayOfCurrentWeek.setDate(today.getDate() - currentDay)
    // // calcula el sabado de la semana actual
    // const saturdayOfCurrentWeek = new Date(sundayOfCurrentWeek)
    // saturdayOfCurrentWeek.setDate(sundayOfCurrentWeek.getDate() + 6)
    
    // // console.log(today.getDate() - currentDay)
    // // console.log(sundayOfCurrentWeek)
    // const filteredData = data.filter(entry => {
    //     const entryDate = new Date(entry.date)
    //     // console.log(entry.date)
    //     if( entryDate >= sundayOfCurrentWeek && entryDate <= saturdayOfCurrentWeek){
    //         return entryDate
    //     }
    // })
    // const sortedData = Sort(filteredData)
    return filteredData
}

function filterDataByMonth(data) {
    const filteredData = data.filter(entry => {
        // cuantos dias tiene el mes. 
        // filtrar todas las entradas en ese rango.
        const entryDate = new Date(entry.date);
        const today = new Date()
        const entryMonth = entryDate.getMonth() + 1
        const entryYear = entryDate.getFullYear()
        const actualMonth = `${today.getFullYear()}-${today.getMonth()+1}`
        
    
        if (actualMonth == `${entryYear}-${entryMonth}`) {
            return entry
        }
        return false
    })

    const sortedData = Sort(filteredData)

    return sortedData
}

function filterDataBySixMonths(data){
    //definir año y mes actual
    // si 
    const filtered6M = data.filter(entry => {
        const entryDate = parseLocalDate(entry.date);
        return entryDate >= sixMonthsAgoStart && entryDate <= todayEnd;
    });
return filtered6M
}

function filterDataByYear(data) {
    // const filteredData = data.filter(entry => {
    //     if (entry.date) {
    //         const entryDate = new Date(entry.date)
    //         const entryYear = entryDate.getFullYear()
    //         return entryYear === data[3]
    //     }
    // })
    // const sortedData = Sort(filteredData)

    const filtered1Y = data.filter(entry => {
        const entryDate = parseLocalDate(entry.date);
        return entryDate >= twelveMonthsAgoStart && entryDate <= todayEnd;
    });
    return filtered1Y
}

// Clamp to avoid end-of-month rollovers (e.g., Mar 31 → Aug 31)

const fiveYearsAgoStart = startOfDay(monthsAgoClamped(todayEnd, 60));

/////

export const TotalSum2 = (filteredDataList) => {
    // filteredDataList.map(i => {
    //     console.log(i.amount)

    // })
    // console.log(filteredDataList)
    

    const total = filteredDataList.reduce((sum, entry) => {
        return sum + (typeof entry.amount === 'string' ? parseFloat(entry.amount) : entry.amount)
    }, 0)
    return total.toFixed(2)
}

export function Sort(data) {
    const out = data.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB - dateA
    })
    return out
}

FilterByCriteria.PropTypes = {
    data: PropTypes.array.isRequired
}

export function FilterByCriteria(data,criteria){
    let result
    if(criteria == '1W'){
        result =filterDataByWeek(data)
    }if(criteria == '1M'){
        result = filterDataByMonth(data)
    }if(criteria == '6M'){
        result = filterDataBySixMonths(data)
    }if(criteria == '1Y'){
        result = filterDataByYear(data)
    }if(criteria == '5Y'){
        const filtered5Y = data.filter(entry => {
          const entryDate = parseLocalDate(entry.date);
            return entryDate >= fiveYearsAgoStart && entryDate <= todayEnd;
        });
        result = filtered5Y
    }if(criteria == "all"){
        result = data
    }

    return result
}

/**
 * this component manage times frames. 1week, 1month, 6 months, 12 months, 5 years, All.
 * 
 * @param {onChange} callback - es un callback que recoje el criterio de busqueda seleccionado 
 * @returns lista de elementos con los criterios a filtrar, 1 semana, 1 mes, 1 año, 5 años, total historico
 * 
 * Creo debes migrar toda la logica de "movementHistory" relacionada con este componetente aqui adentro.
 * quiere decir, como maneja el estado, el total de transacciones, el montlyIncome y el Expense
 * debe ser todo aca para que realmente sea reutilizable y no se sobreescriba codigo en ningun lado relacionado al tema. 
 * 
 */
export function TimeFrames({onChange}){
    // const timeFrameOpt = ['W','M','Y']
    const timeFrameOpt = ['1W','1M','6M','1Y','5Y','all']
    const [active, setActive] = useState(timeFrameOpt[0])
    const baseItem =
    " w-12 text-center rounded-lg px-2 cursor-pointer select-none";
  const activeItem =
    "bg-primary ring-1 ring-white/40 text-white cursor-default shadow-xl";
  const inactiveItem = "opacity-80 hover:opacity-100";

    const handleActivate = (item) => {
    if (item === active) return;        // ⬅️ evita set y onChange si ya está activo
    setActive(item);
    onChange?.(item);
  };
    return(
        <>
            <article className="border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full flex justify-between text-2xl font-extralight">
                {timeFrameOpt.map((item) => {
                    // const active = value === item
                    return(
                    <div
                        key={item}
                        id={item}
                        role="button"
                        tabIndex={0}
                        aria-pressed={active === item}
                        className={`${baseItem} ${active === item ? activeItem : inactiveItem}`}
                        onClick={() => handleActivate(item)}
                        onKeyDown={(e) => {
                            if ((e.key === "Enter" || e.key === " ") && active !== item) {
                            e.preventDefault();
                            handleActivate(item);
                            }
                        }}>
                        {item}
                    </div> 
                    )
                })}
            </article>
        </>
    )
}

TimeFrames.propTypes = {
    onChange: PropTypes.func.isRequired,
}

{/* filtro de semana, mes, año  */}
// <section>
//         <div className="center period">
//             <span
//                 id="W"
//                 onClick={onPeriodState}
//                 className={`test ${status.period === 'W' ? 'isActive' : ''}`}
//             >
//                 W
//             </span>
//             <span
//                 id="M"
//                 onClick={onPeriodState}
//                 className={`test ${status.period === 'M' ? 'isActive' : ''}`}
//             >
//                 M
//             </span>
//             <span
//                 id="Y"
//                 onClick={onPeriodState}
//                 className={`test ${status.period === 'Y' ? 'isActive' : ''}`}
//             >
//                 Y
//             </span>
//         </div>
//         <br />
//         <div>
//             <span className="h3">{currentMonth} {currentYear}</span>
//             {status.period === 'W' ? (
//                 <span className="h3"> {q}</span>
//             ) : status.period === 'M' ? (
//                 <span className="h3" >{currentMonthName}</span>
//             ) : (
//                 <span className="h3" >{currentYear}</span>
//             )}
//         </div>
//         <br />
//         <div>
//             <section>
//                 <div>Total {status.category}</div>
//                 <div className='h2 totalAmount'>{status.totalThisPeriod}</div>
//                 <span className="h6">Total Transactions in this period {status.map.length}</span>
//             </section>
//         </div>
//     </section> 