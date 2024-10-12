import { AddIncomeForm } from "../Components/Forms";
import { NavBar, TopNavBar } from "../Components/NavBar";

export function AddIncome() {
    return (
        <>
            <TopNavBar title='Add Income' />
            <AddIncomeForm />
            <NavBar />
        </>
    )
};