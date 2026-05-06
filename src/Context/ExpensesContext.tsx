import { createContext, useCallback, useEffect, useState, useMemo } from "react";
import { useUserContext } from "./Context.tsx";
import { getTodayExpenses, getExpensesByTimeFrame } from "../Logic/fetchData.ts";

export interface ExpenseItem {
  amount: number,
  date: string,
  dateStr: object,
  field: string,
  id: string,
  monthKey: string,
  note: string,
  payMethod: string,
  store: string,
  time: string,
  uid: string,
  yearKey: string
  from?:string
}
export interface IncomeItem {
amount: number,
date: string,
dateStr: object,
from: string,
field?: string,
store?: string,
id: string,
monthKey: string,
note: string,
time: string,
uid: string,
}
export type TransactionItem = ExpenseItem | IncomeItem

interface MonthlyCollectionContextType {
  monthlyExpense: TransactionItem[],
  incomeData: TransactionItem[],
  categoryRef:string,
  locationRef: string | null,
  HomeData : TransactionItem[],
  filter: string,
  setLocationRef: React.Dispatch<React.SetStateAction<string | null>>,
  setCategoryRef: React.Dispatch<React.SetStateAction<string>>,
  setHomeData: React.Dispatch<React.SetStateAction<ExpenseItem[] | []>>,
  setFilter: React.Dispatch<React.SetStateAction<string>>,
  refetch: () => void,
}

export const monthlyCollectionContext = createContext<MonthlyCollectionContextType | null>(null);

export const MonthlyCollectionProvider = ({ children } : { children: React.ReactNode}) => {
    const { userId } = useUserContext()
    const [monthlyExpense, setMonthlyExpense] = useState<ExpenseItem[]>([])//
    const [categoryRef,setCategoryRef] = useState('Expenses') //
    const [incomeData,setIncomeData] = useState<IncomeItem[]>([]) //
    const [locationRef, setLocationRef] = useState<string | null>(null)
    const [HomeData, setHomeData] = useState<ExpenseItem[]>([]) //
    const [filter, setFilter] = useState<string>(locationRef === 'movementHistory' ? '1W' : '1M') //

    const example = useCallback(async (f:string,id:string, c:string) => {
        if(c === "Expenses")return await getExpensesByTimeFrame(id, f,'newMonthlyExpenses','expenses');
        if(c === "Income") return await getExpensesByTimeFrame(id, f,'newMonthlyIncome','incomes');
    },[])

    useEffect(() => {
      if(!userId || !locationRef) return
        const fetchTodayExpenses = async (category:string) => {
          if(category === 'Expenses') return  await getTodayExpenses(userId, 'newMonthlyExpenses','expenses');
          if(category === 'Income') return  await getTodayExpenses(userId, 'newMonthlyIncome','incomes');
        }
        if(locationRef === '/'){
          setMonthlyExpense([])
            fetchTodayExpenses(categoryRef).then(result =>{
              setHomeData(result as ExpenseItem[])
            });
        }
        
        if(locationRef === '/movementHistory'){
          setMonthlyExpense([])
          example(filter,userId,categoryRef).then((result) => {
            setMonthlyExpense(result as ExpenseItem[])
          })
        }
        if(locationRef ==='/reports'){
          setMonthlyExpense([])
          example(filter,userId,'Expenses').then((result) => {
            setMonthlyExpense(result as ExpenseItem[])
          })
          example(filter,userId,'Income').then((result) => {
            setIncomeData(result as IncomeItem[])
            
          })
        }
    }, [userId,locationRef,filter,categoryRef,example])

    const exampleValue = useMemo(() => ({
        filter,
        setFilter,
        refetch : () =>  example(filter,userId,categoryRef)
    }),[filter,setFilter,example, userId, categoryRef])

    return <monthlyCollectionContext.Provider value={{ 
        
        categoryRef,
        monthlyExpense, 
        incomeData,
        locationRef,
        HomeData, 
        filter,
        
        setCategoryRef,
        setLocationRef,
        setHomeData,
        setFilter,
        refetch: exampleValue.refetch

      }}>
        {children}
    </monthlyCollectionContext.Provider>
}