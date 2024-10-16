import '../Styles/pages/Home.css'
import '../Styles/main.css'
import { NavBar, TopNavBar } from "../Components/NavBar"
// import { ProfileMenu } from '../Components/ProfileMenu'
import { auth, db } from '../../services/firebaseConfig'

import { buildingBranch } from '../Logic'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../Context/Context'
import { collection } from 'firebase/firestore'
import { monthlyCollectionContext } from '../Context/ExpensesContext'
import { TotalSum, Transactions } from '../Components/Records'
export function Home() {

    const { userId, userName } = useContext(UserContext)
    const { monthlyExpense } = useContext(monthlyCollectionContext)

    return (
        <>
            <NavBar />
            <TopNavBar title='Home' />
            <article className='container'>
                <section>
                    <span className='h3' >Hi {userName}</span>
                    <br />
                    <br />
                </section>
                <section className='ShortRecords'>  {/*  Records */}
                    <TotalSum className='income' title='Income' collectionRef={'monthlyIncome'} />
                    <TotalSum className='expense' title='Spend' collectionRef={'monthlyExpenses'} />
                    <section className='activities center h5'>
                        <Link to={'#'} onClick={buildingBranch}>
                            <span>Monthly Activity</span>
                            <span><ion-icon name="chevron-forward-outline"></ion-icon></span>
                        </Link>  {/* Monthly Activitie */}
                    </section>
                </section>
                <Transactions />
            </article>
            <NavBar />

        </>
    )
}