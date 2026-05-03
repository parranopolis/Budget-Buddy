import type { ExpenseItem } from "../Context/ExpensesContext.tsx";
import {db} from "../services/firebaseConfig.ts"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

// -------- HElPERS --------
export function todayStrLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // "YYYY-MM-DD"
}
function dateToStrLocal(d:Date) {
  // local YYYY-MM-DD
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  return `${yyyy}-${mm}-${dd}`;
}


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
const pad2 = (n:number) => String(n).padStart(2, "0");
// const monthKeyFromDate = (d:Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;

function startDateFromFrame(frame:string) {
  const end = new Date(); // today (local)
  let start : Date;
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

// -------- Firebase Functions --------

export async function getTodayExpenses(uid:string,
  collectionName:string,
  subCollection:string
): Promise<ExpenseItem[]> {
  const today = todayStrLocal();

  const colRef = collection(
    db,
    collectionName,
    uid,
    subCollection,
  );

  const q = query(colRef, where("date", "==", today));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ExpenseItem);
}

export async function getExpensesByTimeFrame(
  uid:string, 
  frame:string, 
  collectionName:string, 
  subCollectionName:string
):Promise<ExpenseItem[]> {
    const { start, end } = startDateFromFrame(frame);
    // End date is always today
    const endStr = dateToStrLocal(end);
    // Start date is depends on the time frame
    const startStr = dateToStrLocal(start);

    const colRef = collection(db,collectionName,uid,subCollectionName);

    console.log(startStr)
    console.log(endStr)
    console.log('-------')
    //   Range query using lexicographic YYYY-MM-DD
      const qRange = query(
        colRef,
        where("date", ">=", startStr),
        where("date", "<=", endStr),
        orderBy("date", "desc")
      );

      const snap = await getDocs(qRange);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ExpenseItem);
}