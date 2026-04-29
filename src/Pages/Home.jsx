import "../Styles/pages/Home.css";
import "../Styles/main.css";
import { NavBarTest} from "../Components/NavBar";

import { useContext, useState } from "react";
import { UserContext } from "../Context/Context.tsx";
import { TotalSum, Transactions } from "../Components/Records";
import { Link } from "react-router-dom";
import { monthlyCollectionContext } from "../Context/ExpensesContext.tsx";

export function Home() {

  const { userName } = useContext(UserContext);
  const { HomeData, categoryRef, setCategoryRef } = useContext(monthlyCollectionContext)
  
  const [state,setState] = useState({
    category: categoryRef,
    icon :<ion-icon name="contrast-outline"></ion-icon>
  })

const handleShowCategory = () =>{
  const nextCategory = categoryRef === "Expenses" ? 'Income' : 'Expenses'
  setState(prevStatus => ({
    ...prevStatus,
    category : nextCategory,
    icon : prevStatus.category === 'Expenses' ? <ion-icon name="contrast"></ion-icon> : <ion-icon name="contrast-outline"></ion-icon>,
  }))
  setCategoryRef(nextCategory)
}

  return (
    <>
      <section className="bg-main py-8 px-8 flex flex-col gap-8 shadow">
        {/* personal info */}
        <article className="text-2xl grid grid-cols-[auto,1fr,auto] gap-4 items-center">
          <div className="bg-white shadow rounded-full w-18 h-18 col-start-1">
            <img src="/logo.webp" alt="" className="rounded-full" />
          </div>
          <span className="bg-white py-4 px-6 rounded-2xl shadow min-w-0 text-center">{userName}</span>
          <span className="col-start-4" onClick={handleShowCategory}>{state.icon}</span> 
        </article>
        {/*  Records */}
        <article className="">
      
         <TotalSum        
                className=""
                title={categoryRef === 'Expenses' ? 'Outcome' : 'Income'}
                collectionRef={categoryRef}
                data={HomeData}
              />
        </article>
        {/* Action Buttons */}
        <article className="bg-white shadow flex justify-around rounded-2xl mb-4">
              <Link className="flex flex-col items-center justify-center text-lg bg-highlight m-8 rounded-lg shadow-2xl w-28 h-28" to={"/addIncome"}>                
                    +<span>Income</span>
              </Link>
              <Link className="flex flex-col items-center justify-center text-white text-lg bg-accent m-8 rounded-lg shadow-2xl w-28 h-28" to={"/DailyExpense"}>                
                    -<span>Outcome</span>
              </Link>
         </article>
      </section>
      {/* transactions */}
      <section className="py-8 px-8">
        <Transactions data={HomeData} collectionRef={categoryRef} filterCategory={{activeCategories:[]}}/>
      </section>
      <aside>
        <NavBarTest />
      </aside>
    </>
  );
}
