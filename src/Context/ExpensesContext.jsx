import { createContext, useCallback, useContext, useEffect, useState, useMemo } from "react";
import { UserContext } from "./Context";
import { collection, getDocs, query, where,orderBy } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";

export const monthlyCollectionContext = createContext();

export const MonthlyCollectionProvider = ({ children }) => {
    const { userId } = useContext(UserContext)
    const [monthlyExpense, setMonthlyExpense] = useState([])
    const [itemId, setItemId] = useState('')
    const [locationRef, setLocationRef] = useState(null)
    const [filter, setFilter] = useState(locationRef === 'movementHistory' ? '1W' : '1M')
    // const location = useLocation()
    const example = useCallback(async (f,id) => {
    return await getExpensesByTimeFrame(id, f);
    },[])

    useEffect(() => {
        if(!userId || !locationRef) return
        const fetchTodayExpenses = async () => {
            const expenses = await getTodayExpenses(userId, 'newMonthlyExpenses','expenses');
            setMonthlyExpense(expenses);
            console.log(expenses)
        }
        if(locationRef === '/'){
            console.log(`filtro: ${filter}, ruta:/home`)
            fetchTodayExpenses();
            return
        }
        
        if(locationRef === '/movementHistory' || locationRef === '/reports'){
            example(filter,userId).then((result) => {
                setMonthlyExpense(result)
            })
            
        }
    }, [userId,locationRef,example,filter,setMonthlyExpense])

    const exampleValue = useMemo(() => ({
        filter,
        setFilter,
        refetch : () =>  example(filter)
    }),[filter,setFilter,example])
    return <monthlyCollectionContext.Provider value={{ monthlyExpense, setMonthlyExpense, setItemId, itemId, exampleValue, filter, setFilter, refetch : () => example(filter), setLocationRef }}>
        {children}
    </monthlyCollectionContext.Provider>
}

// refactorizar funciones. se repite el mismo codigo en income context
function todayStrLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // "YYYY-MM-DD"
}

async function getTodayExpenses(uid,collectionName,subCollection) {
  const today = todayStrLocal();
  const monthKey = today.slice(0, 7); // "YYYY-MM"

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

// async function getATimeFrameInfo(obj) {
//     const getTimePeriod = fetchTimePeriod()
// }


// Reuse your existing helper
// function todayStrLocal() -> "YYYY-MM-DD"

const pad2 = (n) => String(n).padStart(2, "0");
const monthKeyFromDate = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;

function addMonths(date, deltaMonths) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + deltaMonths);
  return d;
}

function addYears(date, deltaYears) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + deltaYears);
  return d;
}

function startDateFromFrame(frame) {
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
    case "all":
      start = null;
      break;
    default:
      start = addMonths(end, -1); // default 1M
  }

  return { start, end };
}

function dateToStrLocal(d) {
  // local YYYY-MM-DD
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

function monthsBetweenInclusive(start, end) {
  const months = [];
  const cur = new Date(start.getFullYear(), start.getMonth(), 1);
  const last = new Date(end.getFullYear(), end.getMonth(), 1);

  while (cur <= last) {
    months.push(monthKeyFromDate(cur));
    cur.setMonth(cur.getMonth() + 1);
  }
  return months;
}

/**
 * Gets expenses for a time frame.
 * frame: '1W','1M','3M','6M','1Y','5Y','all'
 */
export async function getExpensesByTimeFrame(uid, frame) {
  const { start, end } = startDateFromFrame(frame);

    // End date is always today
    const endStr = dateToStrLocal(end);
    // Start date is depends on the time frame
    const startStr = dateToStrLocal(start);

// pendiente activar el filtro -> all transactions
    
    // "all" = read all months docs under /months and then each month's expenses
    // if (frame === "all") {
    //     const monthsRef = collection(db, "newMonthlyExpensesV2", uid, "months");
    //     const monthsSnap = await getDocs(monthsRef);

    //     const all = await Promise.all(
    //     monthsSnap.docs.map(async (m) => {
    //         const monthKey = m.id; // expects 'YYYY-MM'
    //         const expensesRef = collection(
    //         db,
    //             "newMonthlyExpenses",
    //             uid,
    //             "months",
    //             monthKey,
    //             "expenses"
    //         );

    //         // If you want sorted results, include orderBy("dateStr")
    //         const qAll = query(expensesRef, orderBy("dateStr", "asc"));
    //         const snap = await getDocs(qAll);
    //         return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    //     })
    //     );
    
    //     return all.flat();
    // }
    
    // Non-"all": query only the months that intersect the range
    
    
    // inicio y fin del rango de filtrando
    const [startTimeFrame,endTimeFrame] = monthsBetweenInclusive(start, end);

      const colRef = collection(db,"newMonthlyExpenses",uid, "expenses");

      //   Range query using lexicographic YYYY-MM-DD
    //   IMPORTANT: If you use where range + orderBy, Firestore may require an index.
      const qRange = query(
        colRef,
        where("date", ">=", startStr),
        where("date", "<=", endStr),
        orderBy("date", "desc")
      );

      const snap = await getDocs(qRange);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // return startStr
}




// Uso:
// const items = await getTodayExpenses(auth.currentUser.uid);
// console.log(items);


// const expenseCollectionRef = collection(db, 'newMonthlyExpenses')
        // const getMonthlyExpenseList = async () => {
        //     // get info from local json file for testing purposes
        //     let q = []
        //     for (const key in test[userId]) {
        //         if (!Object.hasOwn(test[userId], key)) continue;
                
        //         const expenseData = test[userId][key];
        //         q.push(expenseData)
        //     }
        //     // console.log(q);
        //     setMonthlyExpense(q)

        //     //get info from firebase data base 
        //     try {
           
                
        //         // if (userId !== '') {
        //             // const setQuery = await query(expenseCollectionRef)
        //             // const data = (await getDocs(setQuery))
        //             // const expenseData = data.docs.map(item => ({
        //             //     id: item.id,
        //             //     ...item.data()
        //             // }))
        //             // setMonthlyExpense(expenseData)
        //         // }
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
        // getMonthlyExpenseList()
