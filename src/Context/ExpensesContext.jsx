import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { UserContext } from "./Context";

import test from '../FirebaseCollectionData/NewExpensesStructure.json'
export const monthlyCollectionContext = createContext();

export const MonthlyCollectionProvider = ({ children }) => {
    const { userId } = useContext(UserContext)
    const [monthlyExpense, setMonthlyExpense] = useState([])
    const [itemId, setItemId] = useState('')
    
    useEffect(() => {
        if (!userId) return
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
        const fetchTodayExpenses = async () => {
          const expenses = await getTodayExpenses(userId);
          console.log("Today's expenses:", expenses);
          setMonthlyExpense(expenses);
        }
        fetchTodayExpenses();
    }, [userId])
    return <monthlyCollectionContext.Provider value={{ monthlyExpense, setMonthlyExpense, setItemId, itemId }}>
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

async function getTodayExpenses(uid) {
  const today = todayStrLocal();
  const monthKey = today.slice(0, 7); // "YYYY-MM"

  const colRef = collection(
    db,
    "newMonthlyExpensesV2",
    uid,
    "months",
    monthKey,
    "expenses"
  );

  const q = query(colRef, where("dateStr", "==", today));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Uso:
// const items = await getTodayExpenses(auth.currentUser.uid);
// console.log(items);
