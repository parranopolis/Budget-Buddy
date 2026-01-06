import { useLocation, useNavigate, useParams } from "react-router-dom";
import {NavBarTest } from "../Components/NavBar";
import { where,getFirestore, doc, deleteDoc, query, collection, getDocs } from 'firebase/firestore';
import { useContext, useEffect, useState } from "react";
import { Link} from "react-router-dom";
import { UserContext } from "../Context/Context";

export function TransactionDetail() {

    const { userId } = useContext(UserContext)
    const [stats,setStats] = useState({
        totalAmount:0,
        totalTransactions:0
    })

    const { state } = useLocation()
    const {type, id} = useParams()
    const navigate = useNavigate()

    const db = getFirestore();

    const deleteTransaction = async (id) => {
        if(!userId || !id) return

        const confirm = window.confirm('¿Estás seguro de eliminar este registro?');
        if (!confirm) return;

        try {
            const ref = 
            type === 'Income'
                ? doc(db, 'newMonthlyIncome', userId, 'incomes', id)
                : doc(db, 'newMonthlyExpenses', userId, 'expenses', id); 
            await deleteDoc(ref);
            console.log('Documento eliminado correctamente');
                navigate(-1)
            } catch (error) {
            console.error('Error eliminando el documento:', error);
    }
    };

    useEffect(()=>{
        if(!userId || !state) return
        if(type === "Expenses") getMerchanStats(userId, state.store, state.monthKey).then(setStats)
    },[userId, state,type]);
    return (
        <>
            <main className="h-screen">
{/* 2F855A */}
{/* 4A5568 36% */}
                <section className="bg-[#2F855A] h-[25%] flex justify-between items-end-safe px-12 pb-8 text-white">
                    <div className="w-26 h-26 bg-[#4A5568] opacity-36 rounded-2xl">
                        <span></span>
                    </div>
                    <div className="">
                         <h4 className="text-xl text-right ">{state.store === undefined ? 'Income' : state?.field}</h4> {/* Category */}
                         <h2 className="text-2xl text-right max-w-50 font-semibold">{state.store === undefined ? state?.from : state?.store}</h2> {/* Merchand Name */}
                    </div>
                </section>
                <section className="w-4/5 m-auto mt-8 flex flex-col gap-8">
                    
                    <article className="flex justify-between items-center">
                        <div className="max-w-50">
                            <span className="text-xl">{state?.date}</span>
                            <br />
                            <span className="text-sm text-gray-500">
                                {state?.note ? `Notes: ${state.note}` : ''}
                            </span>
                        </div>
                        <div>
                            <span className="text-5xl">${state?.amount}</span>
                        </div>
                    </article>
                    <article className="text-center">
                        <Link key={id} to={`/${type === "Income" ? 'addIncome' : 'DailyExpense'}/${id}`} state={state}>
                            <div className="rounded-xl text-decoration-line h-10 bg-[rgba(74,85,104,0.36)] text-black">Edit</div>{/* Takes to edit page  */}
                        </Link>
                        <div className="rounded-xl text-decoration-line h-10 bg-red-300 text-red-700 mt-4" onClick={() => deleteTransaction(id)}>Delete</div> {/* Delete de document, go back to the  previous page */}
                    </article>
                    <article>
                    </article>
                    {type != "Expenses" ? '' :
                    <article className="flex justify-between">
                        <div className="">
                            <span className="text-xs">Total this month on this merchand</span><br/>
                            <span className="text-4xl">${stats.totalAmount}</span>
                        </div>
                        <div className="text-center">
                            <span className="text-xs">Total Transactions</span><br/>
                            <span className="text-4xl -center">{stats.totalTransactions}</span>
                        </div>
                    </article>
                    }
                </section>
            </main>
            <aside className="">                
                <NavBarTest />
            </aside>
        </>
    )
}

const getMerchanStats = async(userId, storeName, monthKey) =>{
    const db = getFirestore();
    const q = query(
        collection(db,'newMonthlyExpenses', userId, 'expenses'),
        where('store', '==', storeName),
        where('monthKey', '==', monthKey)
    )

    const snapshot = await getDocs(q)

    let totalAmount = 0

    snapshot.forEach(doc => {
        totalAmount += doc.data().amount
    })

    return{
        totalAmount: Number(totalAmount.toFixed(2)),
        totalTransactions: snapshot.size
    }
}