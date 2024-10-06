import { useState } from 'react'
import '../Styles/components/NavBar.css'
import '../Styles/main.css'
import { Link } from 'react-router-dom'
import { ProfileMenu } from './ProfileMenu'
import { buildingBranch } from '../Logic'

export function NavBar() {

    const [state, setState] = useState('disable')
    var q = window.innerHeight - 70
    return (
        <>
            {/* <ProfileMenu /> */}
            <section className={`collection movementMenu ${state}`}>
                <Link onClick={buildingBranch} className="collection-item h6">Income</Link>
                <Link className="collection-item h6" to={'DailyExpense'} >Daily Expense</Link>
                <Link onClick={buildingBranch} className="collection-item h6" >Monthly Expense</Link>
            </section>
            <article className='navBar shadow ' style={{ top: `${q}px` }}>
                <section onClick={buildingBranch} className='h5 navBar-Resume'>Resume</section> {/* Go to Resume View = ? */}
                <section id='addMovement' onClick={e => state != 'is-active' ? setState('is-active') : setState('disable')} className='h5 navBar-NewMovement z-depth-5'> <ion-icon name="add-outline"></ion-icon> </section> {/* this is representated by a + symbol for a new Movement and show a modal with differtents options : Income, Daily Expense, Monthly Expense. */}
                <section onClick={buildingBranch} className='h5 navBar-Dashboard'>Dashboard</section>  {/* Go to dashboard = Home */}
            </article>
        </>
    )
}

export function TopNavBar({ title }) {
    return (
        <>
            <nav className='TopNavBar z-depth-3 '>
                <div className="row">
                    <div className='col s10'>
                        <span className='h3'>{title}</span>
                    </div>
                    <div className='col s2 right'>
                        <ProfileMenu />
                    </div>
                </div>
            </nav>
        </>
    )
}