import { useNavigate, Link, useLocation } from "react-router-dom"
import { useEffect, useRef, useState, useContext } from 'react'
import { auth } from "../../services/firebaseConfig"
import { signOut } from "firebase/auth"

import { buildingBranch } from '../Logic'
import { UserContext } from "../Context/Context"

import '../Styles/components/NavBar.css'
import '../Styles/main.css'
import useOutsideClick from "../Logic/modal"

export function NavBar() {
    const [modalState, setModalState] = useState('disable')

    const [navBarState, setNavBarState] = useState('')

    const [lastScrollY, setLastScrollY] = useState(0)

    const modalReft = useRef(null)

    const handleScroll = () => {

        const currentScrollY = window.scrollY

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setNavBarState('disable')
        } else if (currentScrollY < lastScrollY) {
            setNavBarState('')
        }

        setLastScrollY(currentScrollY)
    }


    useEffect(() => {
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }

    }, [lastScrollY])
    useOutsideClick(modalReft, () => setModalState('disable'))

    return (
        <>
            <section className={`collection z-depth-3 ${modalState} movementMenu`} ref={modalReft}>
                <Link className="collection-item h6" to={'/addIncome'}>Income</Link>
                <Link className="collection-item h6" to={'/DailyExpense'} >Daily Expense</Link>
                <Link onClick={buildingBranch} className="collection-item h6" >Monthly Expense</Link>
            </section>
            {/* <AddMovement /> */}
            <article className={`navBar shadow z-depth-3 ${navBarState}`}>
                <section className='h5 navBar-Dashboard'>
                    <Link to={'/'}>Home</Link>{/* Go to dashboard = Home */}
                </section>
                <section
                    id='addMovement'
                    onClick={e => modalState != 'is-active' ? setModalState('is-active') : setModalState('disable')}
                    className='h5 navBar-NewMovement z-depth-5'
                >
                    <ion-icon name="add-outline"></ion-icon>
                    {/* this is representated by a + symbol for a new Movement and show a modal with differtents options : Income, Daily Expense, Monthly Expense. */}
                </section>
                <section className='h5 navBar-Resume'>
                    <Link to={'/movementHistory'}>Records</Link>{/* Go to Resume View = ? */}
                </section>
            </article>
        </>
    )
}

export function TopNavBar({ title }) {
    const location = useLocation()
    let isTitle = title
    if (location.pathname == '/') {
        isTitle = <div className="logo" style={{ color: 'black' }}></div>
    }
    return (
        <>
            <nav className='TopNavBar z-depth-3 '>
                <div className="row">
                    <div className='col s10'>
                        <Link to={'/'}>
                            <span className='h3'>{isTitle}</span>
                        </Link>
                    </div>
                    <div className='col s2 right'>
                        <ProfileMenu />
                    </div>
                </div>
            </nav>
            <br />
        </>
    )
}

function ProfileMenu() {
    const [state, setState] = useState('disable')

    const modalReft = useRef(null)

    const reRoute = useNavigate()
    const { userId, setUserId } = useContext(UserContext)

    useOutsideClick(modalReft, () => setState('disable'))

    const logAuth = async () => {
        try {
            await signOut(auth).then((result) => {
                setUserId(null)
                reRoute('/login')
            })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <section
                className="profile z-depth-3 col"
                onClick={e => state != 'is-active' ? setState('is-active') : setState('disable')}
            >
                <section className="profileCircle col s1" >
                </section>
            </section>
            <section className={`collection z-depth-3 ${state} profileMenu`} ref={modalReft}>
                <Link to="/" className="collection-item profileOptions">Home</Link>
                <Link to="#!" onClick={buildingBranch} className="collection-item profileOptions">Settings</Link>
                <Link onClick={logAuth} className="collection-item profileOptions">Logout</Link>
            </section>
        </>
    )
}