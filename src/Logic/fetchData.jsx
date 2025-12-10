import { UserContext } from "../Context/Context";
import { useContext, useEffect, useState } from "react";
import {db, collection, query, where, getDocs} from "../services/firebaseConfig"

export function TodayExpenseData(){
        const { userId} = useContext(UserContext)
        const [todayExpenses, setTodayExpenses] = useState([])

    useEffect(() => {
        if(!userId) return
        
        const fetchTodayExpenses = async () => {
            const expenses = await getTodayExpenses(userId, 'newMonthlyExpensesV2', 'expenses');
            setTodayExpenses(expenses);
        }
        
        return fetchTodayExpenses()
    },[userId,])
}

// refactorizar funciones. se repite el mismo codigo en income context
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
