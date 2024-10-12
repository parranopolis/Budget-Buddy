import '../Styles/pages/Home.css'
import '../Styles/main.css'
import { NavBar, TopNavBar } from "../Components/NavBar"
// import { ProfileMenu } from '../Components/ProfileMenu'
import { auth } from '../../services/firebaseConfig'

import { useContext } from 'react'
import { UserContext } from '../Context/Context'
export function Home() {

    const { userId } = useContext(UserContext)
    return (
        <>
            <NavBar />
            <TopNavBar title='Home' />

            <span>{userId}</span>


        </>
    )
}