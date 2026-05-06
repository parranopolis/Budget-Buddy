import '../Styles/main.css'
import PropTypes from 'prop-types'
import type { ExpenseItem } from '../Context/ExpensesContext.tsx';

/////////////////////

// Helpers
const startOfDay = (d:Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay   = (d:Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

// Parse "YYYY-MM-DD" (or "YYYY/MM/DD") as LOCAL date (not UTC)
export function parseLocalDate(input:string | Date | number) {
  if (input instanceof Date) return startOfDay(input);
  if (typeof input === 'string') {
    const parts = input.split(/[-/]/).map(Number);
    const [y, m, d] = [parts[0] ?? 0, parts[1] ?? 1, parts[2] ?? 1];
    return new Date(y, m - 1, d);
    // const [y, m, d] = input.split(/[-/]/).map(Number);
    // return new Date(y, (m - 1), d); // local midnight
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

function monthsAgoClamped(baseDate: Date, months:number): Date {
    const day = baseDate.getDate();
    const tmp = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    tmp.setMonth(tmp.getMonth() - months);
    const lastDay = new Date(tmp.getFullYear(), tmp.getMonth() + 1, 0).getDate();
    tmp.setDate(Math.min(day, lastDay));
  return tmp;
}

const todayEnd = endOfDay(new Date());
const sixMonthsAgoStart = startOfDay(new Date(
  todayEnd.getFullYear(),
  todayEnd.getMonth() - 6,
  todayEnd.getDate()
));

const twelveMonthsAgoStart = startOfDay(monthsAgoClamped(todayEnd, 12));


function filterDataByWeek(data: ExpenseItem[]) {
    const filteredData = data.filter(entry => {
        const entryDate = parseLocalDate(entry.date);
        return entryDate >= weekStart && entryDate <= weekEnd;
    });
    return filteredData
}

function filterDataByMonth(data: ExpenseItem[]) {
    const filteredData = data.filter(entry => {
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

function filterDataBySixMonths(data: ExpenseItem[]){

    const filtered6M = data.filter(entry => {
        const entryDate = parseLocalDate(entry.date);
        return entryDate >= sixMonthsAgoStart && entryDate <= todayEnd;
    });
    const sortedData = Sort(filtered6M)

return sortedData
}

function filterDataByYear(data:ExpenseItem[]) {

    const filtered1Y = data.filter(entry => {
        const entryDate = parseLocalDate(entry.date);
        return entryDate >= twelveMonthsAgoStart && entryDate <= todayEnd;
    });
    return filtered1Y
}

// Clamp to avoid end-of-month rollovers (e.g., Mar 31 → Aug 31)

const fiveYearsAgoStart = startOfDay(monthsAgoClamped(todayEnd, 60));

/////

export const TotalSum2 = (filteredDataList: ExpenseItem[]) => {
    
    const total = filteredDataList.reduce((sum, entry) => {
        return sum + (typeof entry.amount === 'string' ? parseFloat(entry.amount) : entry.amount)
    }, 0)
    return total.toFixed(2)
}

export function Sort(data: ExpenseItem[]) {
    const out = data.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB.getTime() - dateA.getTime()
    })
    return out
}

FilterByCriteria.PropTypes = {
    data: PropTypes.array.isRequired
}

export function FilterByCriteria(data: ExpenseItem[],criteria:string){
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


//formatea el texto ingresado por el usuario haciendo mayuscula la primera letra de cada palabra y eliminando espacios innecesarios. 

// Esta función se puede utilizar para formatear el nombre de la tienda o cualquier otro texto ingresado por el usuario antes de guardarlo o mostrarlo en la interfaz.

export function FormatingText(string: string) {
    const cleanText = string
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    return cleanText;
}