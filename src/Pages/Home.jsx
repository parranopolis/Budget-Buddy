import '../Styles/pages/Home.css'
import '../Styles/main.css'
import { NavBar, TopNavBar } from "../Components/NavBar"

import { useContext } from 'react'
import { UserContext } from '../Context/Context'
import { TotalSum, Transactions } from '../Components/Records'

export function Home() {

    const { userName } = useContext(UserContext)
    return (
        <>
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
                    {/* <section className='activities center h5'>2
                        <Link to={'#'} onClick={buildingBranch}>
                            <span>Monthly Activity</span>
                            <span><ion-icon name="chevron-forward-outline"></ion-icon></span>
                        </Link>  Monthly Activitie
                    </section> */}
                </section>
                <hr />
                <br />
                <Transactions />
            </article>
            <NavBar />

        </>
    )
}