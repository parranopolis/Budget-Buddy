import '../Styles/pages/Home.css'
import '../Styles/main.css'
import { NavBar, NavBarTest, TopNavBar } from "../Components/NavBar"

import { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../Context/Context'
import { TotalSum, Transactions } from '../Components/Records'
import { Link } from 'react-router-dom'

export function Home() {

    const [date, setDate] = useState('')
    const { userName } = useContext(UserContext)

    const getDate = new Date()
    useEffect(() => {

        const year = getDate.getFullYear()
        const month = String(getDate.getMonth() + 1).padStart(2, '0')
        const day = String(getDate.getDate()).padStart(2, '0')
        setDate(`${year}-${month}-${day}`)
        // setDate('2024-11-03')

    }, [getDate])

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
                    {date != '' ? <>
                        <TotalSum className='income' title='Income' collectionRef={'monthlyIncome'} date={date} />
                        <TotalSum className='expense' title='Spend' collectionRef={'monthlyExpenses'} date={date} />
                    </> : ''}

                </section>
                <hr />

                <section className='action'>
                    <h4 className='h4'>Actions</h4>
                    <div>
                        <Link className='first' to={'/addIncome'}>
                            <div className='options'>
                                <span className='optionIcon'><ion-icon name="add-outline"></ion-icon></span>
                                <span>Income</span>
                            </div>
                        </Link>
                        <Link className='second' to={'/DailyExpense'}>
                            <div className='options'>
                                <span className='optionIcon'><ion-icon name="sad-outline"></ion-icon></span>
                                <span>Outcome</span>
                            </div>
                        </Link>
                        {/* <div className='options'>
                            <span className='optionIcon'><ion-icon name="calendar-outline"></ion-icon></span>
                            <span>Monthly</span>
                        </div> */}
                    </div>
                </section>
                <br />
                <hr />
                <br />
                <Transactions date={date} />
            </article>
            <aside>
                {/* <NavBarTest /> */}

                <NavBar />
            </aside>
        </>
    )
}