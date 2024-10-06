import '../Styles/pages/Movements.css'

import { NavBar, TopNavBar } from "../Components/NavBar";
import { Link } from "react-router-dom";
import { Submit } from "../Components/Buttons";



export function DailyExpense() {

    return (
        <>
            <TopNavBar title='Add Income' />
            <article className="container">

                <section>
                    <section className="authForm col">
                        <div className="row">
                            <div className="input-field col s12">
                                <input type="number" pattern="[0-9]*" inputMode="numeric" id='amount' />
                                <label className="active" htmlFor='amount'>Amount</label>
                            </div>
                            <div className="input-field col s12">
                                <input type="text" id='store' />
                                <label className="active" htmlFor="store">Store</label>
                            </div>
                            <div className="input-field col s12">
                                <input type="date" id='date' />
                                <label className="active" htmlFor="date">Date</label>
                            </div>
                            <div className="input-field col s12">
                                <select className="browser-default" defaultValue="">
                                    <option value="" disabled>
                                        Pay method
                                    </option>
                                    <option value="1">Chash</option>
                                    <option value="2">Card</option>
                                </select>
                            </div>
                            <div className="input-field col s12">
                                <select className="browser-default" defaultValue="">
                                    <option value="" disabled>
                                        Field
                                    </option>
                                    <option value="1">Food</option>
                                    <option value="2">Gas</option>
                                    <option value="3">General</option>
                                    <option value="4">Necesary</option>
                                    <option value="4">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="input-field col s12">
                            <textarea id="note" className="materialize-textarea" ></textarea>
                            <label className="active" htmlFor="note">Note</label>
                        </div>
                        <Submit text="Send" />
                    </section >
                </section>
            </article>
            <NavBar />
        </>
    )
}