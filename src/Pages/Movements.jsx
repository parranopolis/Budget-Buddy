import '../Styles/pages/Movements.css'

import { NavBar, TopNavBar } from "../Components/NavBar";
import { Link } from "react-router-dom";
import { Submit } from "../Components/Buttons";
import { useContext, useEffect, useState } from 'react';

import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../services/firebaseConfig';
import { UserContext } from '../Context/Context';
import { AddIncomeForm } from '../Components/Forms';



export function DailyExpense() {
    const expenseCollectionRef = collection(db, 'monthlyExpenses')
    const { userId } = useContext(UserContext)

    const [formData, setFormData] = useState({
        amount: '',
        date: '',
        field: '',
        payMethod: '',
        store: '',
        note: ''
    })
    const [formError, setFormError] = useState('')
    const [succesMessage, setSuccessMessage] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const sendForm = async (e) => {
        e.preventDefault()
        const { amount, date, field, payMethod, store, note } = formData
        if (!amount || !date || !field) {
            setFormError('Please fill in all required fields')
            return
        }
        setFormError('')
        try {
            await addDoc(expenseCollectionRef, {
                uid: userId,
                amount: Number(amount),
                date,
                field,
                payMethod,
                store,
                note,
                time: new Date().toLocaleTimeString()
            })
            setSuccessMessage('Expense added successfully!');
            setFormData({
                amount: '',
                date: '',
                field: '',
                payMethod: '',
                store: '',
                note: '',

            });
        } catch (error) {
            console.log(error)
            setFormError('Failed to add expense. Try again later.');
        }
    }


    return (
        <>
            <TopNavBar title='Daily Expense' />
            <article className="container">
                <div className='center'>
                    <br />
                    {formError && <span className='formError'>{formError}</span>}
                    {succesMessage && <span className='formSucces'>{succesMessage}</span>}
                </div>
                <section>
                    <form action="" id='testForm' className='DailyExpensiveForm' onSubmit={sendForm}>
                        <section className="authForm col">
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        name='amount'
                                        value={formData.amount}
                                        onChange={handleChange}
                                        type="number"
                                        pattern="[0-9]*"
                                        inputMode="decimal"
                                        id='amount'
                                        required
                                        className='validate'
                                    />
                                    <label className="active" htmlFor='amount'>Amount *</label>
                                </div>

                                <div className="input-field col s12">
                                    <input
                                        name='date'
                                        value={formData.date}
                                        onChange={handleChange}
                                        type="date"
                                        id='date'
                                        required
                                        className='validate date'
                                    />
                                    <label className="active" htmlFor="date">Date *</label>
                                </div>

                                <div className="input-field col s12">
                                    <select
                                        name='field'
                                        onChange={handleChange}
                                        value={formData.field}
                                        className="browser-default validate"
                                        required
                                    >
                                        <option value="" disabled>
                                            Field *
                                        </option>
                                        <option value="Food">Food</option>
                                        <option value="Gas">Gas</option>
                                        <option value="General">General</option>
                                        <option value="Necesary">Necesary</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="input-field col s12">
                                    <select
                                        name='payMethod'
                                        value={formData.payMethod}
                                        onChange={handleChange}
                                        id='payMethod'
                                        className="browser-default validate"
                                    >
                                        <option value="" disabled>
                                            Pay method
                                        </option>
                                        <option value="Cash">Cash</option>
                                        <option value="Card">Card</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    name='store'
                                    value={formData.store}
                                    onChange={handleChange}
                                    type="text"
                                    id='store'
                                />
                                <label className="active" htmlFor="store">Store</label>
                            </div>
                            <div className="input-field col s12" onChange={handleChange}>
                                <textarea
                                    name='note'
                                    value={formData.note}
                                    onChange={handleChange}
                                    id="note"
                                    className="materialize-textarea"
                                ></textarea>
                                <label className="active" htmlFor="note">Note</label>
                            </div>
                            <div onClick={sendForm}>
                                <Submit text="Send" />
                            </div>
                        </section >
                    </form>
                </section>
            </article>
            <NavBar />
        </>
    )
}

export function AddIncome() {
    return (
        <>
            <TopNavBar title='Add Income' />
            <AddIncomeForm />
            <NavBar />
        </>
    )
};