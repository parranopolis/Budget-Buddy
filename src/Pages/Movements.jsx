import '../Styles/pages/Movements.css'

import {NavBarTest } from "../Components/NavBar";
import { Submit } from "../Components/Buttons";
import { useContext, useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp, updateDoc,doc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { UserContext } from '../Context/Context';
import { AddIncomeForm } from '../Components/Forms';

import { useMemo } from "react";
import {Timestamp } from "firebase/firestore";
import { useLocation, useParams } from 'react-router-dom';

export function DailyExpense() {
  const { userId } = useContext(UserContext);
  const categories = ["General", "Food", "Gas", "Necessary", "Other"];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [todayDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  });


  const { state } = useLocation()

  const {id} = useParams()
  const isEditMode = Boolean(id)

  // console.log(id)
  const [formData, setFormData] = useState({
    amount: "",
    date: todayDate, // string YYYY-MM-DD
    field: "",
    payMethod: "Card",
    store: "",
    note: "",
  });

  useEffect(() => {
    if(!isEditMode || !state) return

    setFormData((prev) => ({
      ...prev,
      amount: state.amount ?? "",
      date: state.date ?? todayDate,
      field: state.field ?? "",
      payMethod: state.payMethod ?? "Card",
      store: state.store ?? "",
      note: state.note ?? "",
    }))
  },[isEditMode,state,todayDate])


  const [formError, setFormError] = useState("");
  const [succesMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleActiveCategory = (e) => {
    const value = e.currentTarget.dataset.value;
    setFormData((prev) => ({ ...prev, field: value }));
  };

  // ✅ ruta destino: newMonthlyExpensesV2/{uid}/months/{yyyy-MM}/expenses
  const expenseCollectionRef = useMemo(() => {
    if (!userId) return null;
    return collection(db, "newMonthlyExpenses", userId, "expenses");
  }, [userId]);

  const sendForm = async (e) => {
    e.preventDefault();

    const { amount, date, field, payMethod, store, note } = formData;

    if (!userId) {
      setFormError("No userId disponible.");
      return;
    }
    if (!amount || !date || !field) {
      setFormError("Please fill in all required fields");
      return;
    }

    // Timestamp UTC a medianoche para queries por rango sin problemas
    const dateTs = Timestamp.fromDate(new Date(`${date}T00:00:00.000Z`));

    setFormError("");
    setIsSubmitting(true)
    try {
      if(isEditMode){
        await updateDoc(
          doc(db, 'newMonthlyExpenses', userId, 'expenses', id), 
          {
            uid: userId,
            amount: Number(amount),
            field,
            payMethod,
            store,
            note,
            time: new Date().toLocaleTimeString(),
            dateStr: dateTs,     // ✅ string para query exacta (hoy)
            date: date,      // ✅ Timestamp para rangos
            monthKey: date.slice(0, 7),
            yearKey:date.slice(0,4)
          }
        )
      setSuccessMessage("Expense Updated successfully!");
      }else {
      // }else if(!expenseCollectionRef) throw new Error("No se pudo construir la ruta de Firestore.");
        await addDoc(
          expenseCollectionRef, 
          {
            uid: userId,
            amount: Number(amount),
            field,
            payMethod,
            store,
            note,
            time: new Date().toLocaleTimeString(),
            dateStr: dateTs,     // ✅ string para query exacta (hoy)
            date: date,      // ✅ Timestamp para rangos
            monthKey: date.slice(0, 7),
            yearKey:date.slice(0,4)
          }
        );
        setSuccessMessage("Expense added successfully!");
      }
      setFormData({
        amount: "",
        date: todayDate,
        field: "",
        payMethod: "Card",
        store: "",
        note: "",
      });
    } catch (error) {
      console.log(error);
      setFormError("Failed to add expense. Try again later.");
    }finally{
      setIsSubmitting(false)
    }
  };

// {
//     "amount": "0.20",
//     "date": "2025-12-09",
//     "field": "Necessary",
//     "payMethod": "Card",
//     "store": "pizza rica",
//     "note": ""
// }

  return (
    <>
      <main className="mx-8 my-8">
        <h3 className="text-3xl font-medium">{isEditMode ? 'Update Expense' : 'Add Expense'}</h3>

        <section>
          <article className="center">
            <br />
            {formError && <span className="formError">{formError}</span>}
            {succesMessage && <span className="formSucces">{succesMessage}</span>}
          </article>

          <article>
            <form id="testForm" className="grid grid-cols-6 gap-4" onSubmit={sendForm}>
              <div className="col-start-1 col-end-6">
                <input
                  name="amount"
                  onChange={handleChange}
                  type="number"
                  pattern="[0-9]*"
                  inputMode="decimal"
                  id="amount"
                  required
                  className="border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full"
                  placeholder="$ 12,87"
                  value={formData.amount}
                />
                <label className="sr-only" htmlFor="amount">Amount *</label>
              </div>

              <img src="/Scan-Receipt.webp" alt="" className="col-start-6" />

              <div className="col-start-1 col-end-4">
                <input
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  type="date"
                  id="date"
                  required
                  className="text-gray-400 border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full"
                />
                <label className="sr-only" htmlFor="date">Date *</label>
              </div>

              <div className="col-start-4 col-end-7">
                <select
                  name="payMethod"
                  value={formData.payMethod}
                  onChange={handleChange}
                  id="payMethod"
                  className="border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full text-gray-400"
                >
                  <option value="Card">Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div className="col-start-1 col-end-7">
                <input
                  name="store"
                  value={formData.store}
                  onChange={handleChange}
                  type="text"
                  id="store"
                  className="border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full"
                  placeholder="Store Name"
                />
                <label className="sr-only" htmlFor="store">Store</label>
              </div>

              <div className="flex col-start-1 col-end-7 gap-6 overflow-x-auto overscroll-x-contain snap-x snap-mandatory">
                {categories.map((cat) => {
                  const isActive = formData.field === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      data-value={cat}
                      onClick={handleActiveCategory}
                      className={[
                        "w-18 shrink-0 snap-start h-18 rounded-full relative flex items-center justify-center",
                        "bg-category",
                        isActive
                          ? "active-category-button ring-4 ring-white/70 shadow-lg scale-105"
                          : "opacity-80 hover:opacity-100",
                      ].join(" ")}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="col-start-1 col-end-7">
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  id="note"
                  className="border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full"
                  placeholder="Additional Notes"
                />
                <label className="sr-only" htmlFor="note"></label>
              </div>

              <div onClick={sendForm} className='col-start-1 col-end-7'>
                  <Submit text={isSubmitting ? "Saving..." : "Send"} disable={isSubmitting} />
              </div>
            </form>
          </article>
        </section>
      </main>
    <aside>
        <NavBarTest />
    </aside>
    </>
  );
}


export function AddIncome() {
    return (
        <>
            {/* <TopNavBar title='Add Income' /> */}
            <AddIncomeForm />
            {/* <NavBar /> */}
            <NavBarTest />
        </>
    )
};