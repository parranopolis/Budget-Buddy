import '../Styles/pages/Movements.css'

import { NavBar, TopNavBar } from "../Components/NavBar";
import { Link } from "react-router-dom";
import { Submit } from "../Components/Buttons";
import { useContext, useEffect, useState } from 'react';

import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../services/firebaseConfig';
import { UserContext } from '../Context/Context';



export function DailyExpense() {

    const expenseCollectionRef = collection(db, 'monthlyExpenses')
    const { userId } = useContext(UserContext)
    const [amount, setAmout] = useState()
    const [store, setStore] = useState()
    const [date, setDate] = useState()
    const [note, setNote] = useState()
    const [payMethod, setPayMethod] = useState()
    const [field, setField] = useState()
    const [formError, setFormError] = useState('')



    const sendForm = async () => {
        try {
            if (amount == null || date == null || field == null) {
                setFormError('Please fill in all required fields')
            } else {
                await addDoc(expenseCollectionRef, {
                    uid: userId,
                    amount: amount,
                    date: date,
                    field: field,
                    payMethod: payMethod,
                    store: store,
                    note: note,
                })
                setFormError('')
                console.log('enviado')
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <TopNavBar title='Add Income' />
            <article className="container">
                <div className='center'>
                    <br />
                    <span className='formError'>{formError}</span>
                </div>
                <section>
                    <section className="authForm col">
                        <div className="row">
                            <div className="input-field col s12">
                                <input onChange={((e) => setAmout(e.target.value))} type="number" pattern="[0-9]*" inputMode="numeric" id='amount' required className='validate' />
                                <label className="active" htmlFor='amount'>Amount *</label>
                            </div>

                            <div className="input-field col s12">
                                <input type="date" id='date' onChange={((e) => setDate(e.target.value))} className='validate date' />
                                <label className="active" htmlFor="date">Date *</label>
                            </div>

                            <div className="input-field col s12">
                                <select className="browser-default validate" defaultValue="" onChange={((e) => setField(e.target.value))}>
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
                                <select id='payMethod' className="browser-default validate" defaultValue="" onChange={((e) => setPayMethod(e.target.value))}>
                                    <option value="" disabled>
                                        Pay method
                                    </option>
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Card</option>
                                </select>
                            </div>
                        </div>
                        <div className="input-field col s12">
                            <input type="text" id='store' onChange={((e) => setStore(e.target.value))} />
                            <label className="active" htmlFor="store">Store</label>
                        </div>
                        <div className="input-field col s12" onChange={((e) => setNote(e.target.value))}>
                            <textarea id="note" className="materialize-textarea" ></textarea>
                            <label className="active" htmlFor="note">Note</label>
                        </div>
                        <div onClick={sendForm}>
                            <Submit text="Send" />
                        </div>
                    </section >
                </section>
            </article>
            <NavBar />
        </>
    )
}