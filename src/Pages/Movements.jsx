import '../Styles/pages/Movements.css'

import {NavBarTest, TopNavBar } from "../Components/NavBar";
import { Submit } from "../Components/Buttons";
import { useContext, useState } from 'react';

import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { UserContext } from '../Context/Context';
import { AddIncomeForm } from '../Components/Forms';

// export function DailyExpense() {
//     // extract info from data base
//     const expenseCollectionRef = collection(db, 'monthlyExpenses')
//     const { userId } = useContext(UserContext)
//     const categories = ["General", "Food", "Gas", "Necessary", "Other"];
//     const [todayDate,setTodayDate] = useState(()=>{

//         // Create a new Date object for today
//         const today = new Date();

//         // Get year, month, and day
//         const year = today.getFullYear();
//         // Month is 0-indexed, so add 1
//         const month = (today.getMonth() + 1).toString().padStart(2, '0');
//         const day = today.getDate().toString().padStart(2, '0');

//         // Format the date as YYYY-MM-DD
//         const formattedDate = `${year}-${month}-${day}`;

//         return formattedDate
//     })

//     const [formData, setFormData] = useState({
//         amount: '',
//         date: todayDate,
//         field: '',
//         payMethod: '',
//         store: '',
//         note: ''
//     })
//     const [formError, setFormError] = useState('')
//     const [succesMessage, setSuccessMessage] = useState('')
//     const handleChange = (e) => {
//         const { name, value } = e.target
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value
//         }))
//     }

//     const sendForm = async (e) => {
//         e.preventDefault()
//         const { amount, date, field, payMethod, store, note } = formData
//         if (!amount || !date || !field) {
//             setFormError('Please fill in all required fields')
//             return
//         }
//         setFormError('')
//         try {
//             await addDoc(expenseCollectionRef, {
//                 uid: userId,
//                 amount: Number(amount),
//                 date,
//                 field,
//                 payMethod,
//                 store,
//                 note,
//                 time: new Date().toLocaleTimeString()
//             })
//             setSuccessMessage('Expense added successfully!');
//             setFormData({
//                 amount: '',
//                 date: '',
//                 field: '',
//                 payMethod: '',
//                 store: '',
//                 note: '',

//             });
//         } catch (error) {
//             console.log(error)
//             setFormError('Failed to add expense. Try again later.');
//         }
//     }

//     const handleActiveCategory = (e) =>{
//         const value = e.currentTarget.dataset.value
//         setFormData(prev => ({ ...prev, field: value }));
//          //  console.log(value)
//         //  setFormData((prevData) => ({
//         //      ...prevData,
//         //      'field': value
//         //     }))
//         console.log(value)
//     }

//     // const q = document.querySelectorAll('.category')

//     // console.log(q[0])
//     return (
//         <>
//             {/* <TopNavBar title='Daily Expense' /> */}
//             <main className='mx-8 my-8'>
//                 <h3 className='text-3xl font-medium'>Add Expense</h3>
                
//                 <section className="">
//                     <article className='center'>
//                         <br />
//                         {formError && <span className='formError'>{formError}</span>}
//                         {succesMessage && <span className='formSucces'>{succesMessage}</span>}
//                     </article>
//                     <article className=''>
//                         <form action="" id='testForm' className='grid grid-cols-6 gap-4'   onSubmit={sendForm}>
//                              <div className="col-start-1 col-end-6">
//                                 <input
//                                     name='amount'
//                                     // value={formData.amount}
//                                     onChange={handleChange}
//                                     type="number"
//                                     pattern="[0-9]*"
//                                     inputMode="decimal"
//                                     id='amount'
//                                     required
//                                     className='border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full'
//                                     placeholder='$ 12,87'
//                                 />
//                                 <label className="sr-only" htmlFor='amount'>Amount *</label>
//                             </div>
//                             <img src="/Scan-Receipt.webp" alt="" className='col-start-6'/>
//                             {/* Date */}
//                             <div className="col-start-1 col-end-4">
//                                 <input
//                                     name='date'
//                                     value={formData.date}
//                                     onChange={handleChange}
//                                     type="date"
//                                     id='date'
//                                     required
//                                     className='text-gray-400 border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full'
//                                 />
//                                 <label className="sr-only" htmlFor="date">Date *</label>
//                             </div>
//                             {/* payment method */}
//                             <div className="col-start-4 col-end-7">
//                                 <select
//                                     name='payMethod'
//                                     value={formData.payMethod}
//                                     onChange={handleChange}
//                                     id='payMethod'
//                                     className="border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full text-gray-400"
//                                 >
//                                     <option value="Card">Card</option>
//                                     <option value="Cash">Cash</option>
//                                 </select>
//                             </div>
//                             {/* Store Name */}
//                             <div className="col-start-1 col-end-7">
//                                 <input
//                                     name='store'
//                                     value={formData.store}
//                                     onChange={handleChange}
//                                     type="text"
//                                     id='store'
//                                     className='border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full'
//                                     placeholder='Store Name'

//                                 />
//                                 <label className="sr-only" htmlFor="store">Date *</label>
//                             </div>
//                             {/* Categories */}
//                             {/* rgba(149, 153, 151, 0.47) */}
//                             <div className="flex col-start-1 col-end-7 gap-6 overflow-x-auto overscroll-x-contain snap-x snap-mandatory">
//                                 {/* <div onClick={handleActiveCategory} className='category w-18 shrink-0 snap-start h-18 bg-category rounded-full relative flex items-center justify-center'>General</div>
//                                 <div onClick={handleActiveCategory} className='w-18 shrink-0 snap-start h-18 bg-category rounded-full relative flex items-center justify-center'>Food</div>
//                                 <div onClick={handleActiveCategory} className='w-18 shrink-0 snap-start h-18 bg-category rounded-full relative flex items-center justify-center'>Gas</div>
//                                 <div onClick={handleActiveCategory} className='w-18 shrink-0 snap-start h-18 bg-category rounded-full relative flex items-center justify-center'>Necesary</div>
//                                 <div onClick={handleActiveCategory} className='w-18 shrink-0 snap-start h-18 bg-category rounded-full relative flex items-center justify-center'>Other</div> */}
//                                 {categories.map(cat => {
//                                     const isCategodyActive = formData.field === cat
//                                     return (
//                                         <button 
//                                         key={cat}
//                                         type='button'
//                                         data-value={cat}
//                                         onClick={handleActiveCategory}
//                                         className={[
//                                             "w-18 shrink-0 snap-start h-18 rounded-full relative flex items-center justify-center",
//                                             "bg-category",
//                                             isCategodyActive ? "active-category-button ring-4 ring-white/70 shadow-lg scale-105" : "opacity-80 hover:opacity-100"
//                                         ].join(" ")}
//                                         >
//                                             {cat}
//                                         </button>
//                                     )
//                                 })}
//                             </div>
                                
//                                 {/* <select
//                                     name='field'
//                                     onChange={handleChange}
//                                     value={formData.field}
//                                     className="browser-default validate"
//                                     required
//                                 >
//                                     <option value="" disabled>
//                                         Field *
//                                     </option>
//                                     <option value="Food">Food</option>
//                                     <option value="Gas">Gas</option>
//                                     <option value="General">General</option>
//                                     <option value="Necesary">Necesary</option>
//                                     <option value="Other">Other</option>
//                                 </select> */}
//                             {/* Note Segment */}
//                             <div className="col-start-1 col-end-7" onChange={handleChange}>
//                                 <textarea
//                                     name='note'
//                                     value={formData.note}
//                                     onChange={handleChange}
//                                     id="note"
//                                     className="border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full"
//                                     placeholder='Additional Notes'
//                                 ></textarea>
//                                 <label className="sr-only" htmlFor="note"></label>
//                             </div>
//                             <div onClick={sendForm} className='col-start-1 col-end-7'>
//                                 <Submit text="Send" />
//                             </div>
//                         </form>
//                     </article>
//                 </section>
//             </main>
//             {/* <NavBar /> */}
//             <aside>
//                 <NavBarTest />
//             </aside>

//         </>
//     )
// }


import { useMemo } from "react";
import {Timestamp } from "firebase/firestore";

export function DailyExpense() {
  const { userId } = useContext(UserContext);
  const categories = ["General", "Food", "Gas", "Necessary", "Other"];

  const [todayDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  });

  const [formData, setFormData] = useState({
    amount: "",
    date: todayDate, // string YYYY-MM-DD
    field: "",
    payMethod: "Card",
    store: "",
    note: "",
  });

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
    const monthKey = (formData.date || todayDate).slice(0, 7); // "YYYY-MM"
    return collection(db, "newMonthlyExpensesV2", userId, "months", monthKey, "expenses");
  }, [userId, formData.date, todayDate]);

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
    try {
      if (!expenseCollectionRef) throw new Error("No se pudo construir la ruta de Firestore.");

      await addDoc(expenseCollectionRef, {
        uid: userId,
        amount: Number(amount),
        field,
        payMethod,
        store,
        note,
        time: new Date().toLocaleTimeString(),
        dateStr: date,     // ✅ string para query exacta (hoy)
        date: dateTs,      // ✅ Timestamp para rangos
        monthKey: date.slice(0, 7),
      });

      setSuccessMessage("Expense added successfully!");
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
    }
  };

  return (
    <>
      <main className="mx-8 my-8">
        <h3 className="text-3xl font-medium">Add Expense</h3>

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

              {/* <div className="col-start-1 col-end-7"> */}
                {/* tu componente Submit ya hace submit si es button type="submit";
                    si no, deja tu estructura como estabas */}
                {/* <button type="submit" className="w-full">
                  Send
                </button>
              </div> */}
              <div onClick={sendForm} className='col-start-1 col-end-7'>
                                 <Submit text="Send" />
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