import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./Context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";



export const MonthlyIncomeContext = createContext();

export const MonthlyIncomeProvider = ({ children }) => {
    const { userId } = useContext(UserContext)
    const [monthlyIncome, setMonthlyIncome] = useState([])

    // const incomeCollectionRef = collection(db, 'monthlyIncome')

    useEffect(() => {
        if(!userId) return
        const fetchTodayIncome = async () => {
            const income = await getTodayIncome(userId)
            setMonthlyIncome(income)
        }
        // const getMonthlyIncomeList = async () => {
            
            // get Income from Firebase Data base
            // try {
            //     if (userId !== '') {
            //         const setQuery = await query(incomeCollectionRef, where('uid', '==', userId));
            //         const data = (await getDocs(setQuery))
            //         const incomeData = data.docs.map(item => ({
            //             id: item.id,
            //             ...item.data()
            //         }))
            //         setMonthlyIncome(incomeData)
            //     }
            // } catch (error) {
            //     console.log(error)
            // }
        // }
        // getMonthlyIncomeList()
        fetchTodayIncome()
    }, [userId])

    return <MonthlyIncomeContext.Provider value={{ monthlyIncome, setMonthlyIncome }}>
        {children}
    </MonthlyIncomeContext.Provider>
}
// refactorizar funciones. se repite el mismo codigo en expenses context
function todayStrLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // "YYYY-MM-DD"
}

async function getTodayIncome(uid) {
  const today = todayStrLocal();
  const monthKey = today.slice(0, 7); // "YYYY-MM"

  const colRef = collection(
    db,
    "newMonthlyIncomeV2",
    uid,
    "months",
    monthKey,
    "income"
  );

  const q = query(colRef, where("dateStr", "==", today));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}