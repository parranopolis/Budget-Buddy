import { createContext, useCallback, useContext, useEffect, useState, useMemo } from "react";
import { UserContext } from "./Context.tsx";
import { collection, getDocs, query, where,orderBy } from "firebase/firestore";
import { db } from "../services/firebaseConfig.ts";

interface ExpenseItem {
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
}
interface IncomeItem {
amount: number,
date: string,
dateStr: object,
from: string,
id: string,
monthKey: string,
note: string,
time: string,
uid: string,
}

interface MonthlyCollectionContextType {
  monthlyExpense: ExpenseItem[],
  incomeData: IncomeItem[],
  categoryRef:string,
  locationRef: string | null,
  HomeData : ExpenseItem[],
  filter: string,
  setLocationRef: React.Dispatch<React.SetStateAction<string | null>>,
  setCategoryRef: React.Dispatch<React.SetStateAction<string>>,
  setHomeData: React.Dispatch<React.SetStateAction<ExpenseItem[] | []>>,
  setFilter: React.Dispatch<React.SetStateAction<string>>,
  refetch: () => void,
}

export const monthlyCollectionContext = createContext<MonthlyCollectionContextType | null>(null);

export const MonthlyCollectionProvider = ({ children } : { children: React.ReactNode}) => {
    const { userId } = useContext(UserContext)
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

function todayStrLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // "YYYY-MM-DD"
}

async function getTodayExpenses(uid:string,collectionName:string,subCollection:string) {
  const today = todayStrLocal();

  const colRef = collection(
    db,
    collectionName,
    uid,
    subCollection,
  );

  const q = query(colRef, where("date", "==", today));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

const pad2 = (n:number) => String(n).padStart(2, "0");
const monthKeyFromDate = (d:Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;

function addMonths(date:Date, deltaMonths:number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + deltaMonths);
  return d;
}

function addYears(date:Date, deltaYears:number) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + deltaYears);
  return d;
}

function startDateFromFrame(frame:string) {
  const end = new Date(); // today (local)
  let start;

  switch (frame) {
    case "1W":
      start = new Date(end);
      start.setDate(end.getDate() - 7);
      break;
    case "1M":
      start = addMonths(end, -1);
      break;
    case "3M":
      start = addMonths(end, -3);
      break;
    case "6M":
      start = addMonths(end, -6);
      break;
    case "1Y":
      start = addYears(end, -1);
      break;
    case "5Y":
      start = addYears(end, -5);
      break;
    // case "all":
    //   start = null;
    //   break;
    default:
      start = addMonths(end, -1); // default 1M
  }

  return { start, end };
}

function dateToStrLocal(d:Date) {
  // local YYYY-MM-DD
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Gets expenses for a time frame.
 * frame: '1W','1M','3M','6M','1Y','5Y'
 */

export async function getExpensesByTimeFrame(uid:string, frame:string, collectionName:string, subCollectionName:string) {
  const { start, end } = startDateFromFrame(frame);
    // End date is always today
    const endStr = dateToStrLocal(end);
    // Start date is depends on the time frame
    const startStr = dateToStrLocal(start);

    const colRef = collection(db,collectionName,uid,subCollectionName);

    //   Range query using lexicographic YYYY-MM-DD
      const qRange = query(
        colRef,
        where("date", ">=", startStr),
        where("date", "<=", endStr),
        orderBy("date", "desc")
      );

      const snap = await getDocs(qRange);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));

}