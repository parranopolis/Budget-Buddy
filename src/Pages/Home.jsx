import '../Styles/pages/Home.css'
import '../Styles/main.css'
import { NavBar, TopNavBar } from "../Components/NavBar"
import { ProfileMenu } from '../Components/ProfileMenu'
import { auth } from '../../services/firebaseConfig'
export function Home() {

    console.log(auth?.currentUser?.displayName)

    return (
        <>
            <TopNavBar title='Home' />
            <NavBar />
        </>
    )
}