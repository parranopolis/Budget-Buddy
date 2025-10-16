import "../Styles/pages/Home.css";
import "../Styles/main.css";
import { NavBar, NavBarTest} from "../Components/NavBar";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context/Context";
import { TotalSum, Transactions } from "../Components/Records";
import { Link } from "react-router-dom";

export function Home() {
  const [date, setDate] = useState("");
  const { userName } = useContext(UserContext);
  const [category, setCategory] = useState({
    category: 'monthlyExpenses',
    icon: <ion-icon name="contrast-outline"></ion-icon>,
  })

const handleShowCategory = () =>{
  setCategory(prevStatus => ({
    ...prevStatus,
    category: prevStatus.category === 'monthlyExpenses' ? 'monthlyIncome' : 'monthlyExpenses',
    icon : prevStatus.category === 'monthlyExpenses' ? <ion-icon name="contrast"></ion-icon> : <ion-icon name="contrast-outline"></ion-icon>,

  }))
}

  useEffect(() => {
    const getDate = new Date();

    const year = getDate.getFullYear();
    const month = String(getDate.getMonth() + 1).padStart(2, "0");
    const day = String(getDate.getDate()).padStart(2, "0");
    setDate(`${year}-${month}-${day}`);
    // setDate('2024-11-03')
  }, []);

  return (
    <>
      <section className="bg-main py-8 px-8 flex flex-col gap-8 shadow">
        {/* personal info */}
        <article className="text-2xl grid grid-cols-[auto,1fr,auto] gap-4 items-center">
          <div className="bg-white shadow rounded-full w-18 h-18 col-start-1"></div>
          <span className="bg-white py-4 px-6 rounded-2xl shadow min-w-0 text-center">{userName}</span>
          <span className="col-start-4" onClick={handleShowCategory}>{category.icon}</span> 
        </article>
        {/*  Records */}
        <article className="">
          
         <TotalSum
                className=""
                title={category.category === 'monthlyExpenses' ? 'Outcome' : 'Income'}
                collectionRef={category.category}
                date={date}
              />
          {/* {date != "" ? (
            <>
              <TotalSum
                className="income"
                title="Income"
                collectionRef={"monthlyIncome"}
                date={date}
              />
              <TotalSum
                className="expense"
                title="Spend"
                collectionRef={"monthlyExpenses"}
                date={date}
              />
            </>
          ) : (
            ""
          )} */}
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
        <Transactions date={date} collectionRef={category.category} />
      </section>
      <aside>
        <NavBarTest />
        {/* <NavBar /> */}
      </aside>
    </>
  );
}
