import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"

import { auth, db } from "../../services/firebaseConfig"
import { addDoc, collection } from "firebase/firestore"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"

import { UserContext } from "../Context/Context"

import { Submit } from "./Buttons"
import '../Styles/components/Forms.css'
import '../Styles/main.css'

export function LoginForm() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [loginError, setloginError] = useState('')
    const { userId, setUserId } = useContext(UserContext)
    const reRoute = useNavigate()

    const logIn = async () => {
        try {
            if (email == '' || password == '') {
                setloginError("Email or Password can't be empty")
                console.log(loginError)
                throw new Error(loginError)
            }
            else {
                await signInWithEmailAndPassword(auth, email, password).then(() => reRoute('/'))
            }
        } catch (error) {
            setloginError(error.code)
        }
    }

    return (
        <section className="authForm">
            <div className="center formError h6">
                <span>{loginError}</span>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <input type="text"
                        placeholder="email..."
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="active" htmlFor="first_name2">Email</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <input
                        placeholder="*******"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="active" htmlFor="first_name2">Password</label>
                </div>
            </div>
            <span onClick={logIn}>
                <Submit text="Log in" />
            </span>
            <div className="authForm-options p-large">
                {/* <Link to={`/password_recovery`}>Reset password</Link> */}
                <span>No account? </span><Link to={`/signin`}> Create one</Link>
            </div>
        </section >
    )
}

export function PasswordRecoveryForm() {
    return (
        <>
            <section className="authForm">
                <div className="row">
                    <div className="input-field col s12">
                        <input type="text"
                            placeholder="email..."
                            required
                        />
                        <label className="active" htmlFor="first_name2">Email</label>
                    </div>
                </div>
                <Submit text="Reset password" />
                <div className="authForm-options p-large">
                    <Link to={`/login`} className="center">Cancel</Link>
                </div>
            </section>
        </>
    )
}

export function SignIn() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [sigInError, setSigInError] = useState('')

    const singIn = async () => {
        try {
            if (email == '' || password == '') {
                setSigInError("Email or Password can't be empty")
                console.log(sigInError)
                throw new Error(sigInError)
            }
            else {
                await createUserWithEmailAndPassword(auth, email, password).then(() => reRoute('/'))
            }
        } catch (error) {
            setSigInError(error.code)
        }
    }
    const reRoute = useNavigate()
    return (
        <section className="authForm">
            <div className="center formError h6">
                <span>{sigInError}</span>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <input type="text"
                        placeholder="email..."
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="active" htmlFor="first_name2">Email</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <input
                        placeholder="*******"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="active" htmlFor="first_name2">Password</label>
                </div>
            </div>
            <span onClick={singIn}><Submit text="Create Account" /></span>
            <div className="authForm-options p-large">
                <span>Already have one? </span><Link to={`/login`}>Log in</Link>
            </div>
        </section >
    )
}

export function AddIncomeForm() {

    const expenseCollectionRef = collection(db, 'monthlyIncome')
    const { userId } = useContext(UserContext)

    const [formData, setFormData] = useState({
        amount: '',
        date: '',
        from: '',
        note: '',
    })
    const [formError, setFormError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const sendForm = async (e) => {
        e.preventDefault()

        const { amount, date, from, note } = formData
        if (!amount || !date || !from) {
            setFormError('Please fill in all require fields')
            return
        }
        setFormError('')
        try {
            await addDoc(expenseCollectionRef, {
                uid: userId,
                amount: Number(amount),
                date,
                from,
                note,
                time: new Date().toLocaleDateString()
            })
            setSuccessMessage('Income Added successfully')
            setFormData({
                amount: '',
                date: '',
                from: '',
                note: '',
            })
        } catch (error) {
            console.log(error)
            setFormError('Failed to add expense. Try again later.')
        }
    }

    return (
        <>
            <article className="container">
                <section className="center">
                    <br />
                    <span className="formError">{formError}</span>
                    <span className="formSucces">{successMessage}</span>
                </section>
                <section>
                    <form action="" id="addIncomeForm" onSubmit={sendForm}>
                        <section className="col">
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
                                    // placeholder="123.45"
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
                                        className='validate'
                                    />
                                    <label className="active" htmlFor='amount'>Date *</label>
                                </div>
                                <div className="input-field col s12">
                                    <input
                                        name='from'
                                        value={formData.from}
                                        onChange={handleChange}
                                        type="text"
                                        id='from'
                                        required
                                        className='validate'
                                    // placeholder="Example: Amazon"
                                    />
                                    <label className="active" htmlFor='amount'>From *</label>
                                </div>
                                <div className="input-field col s12">
                                    <input
                                        name='note'
                                        type="text"
                                        value={formData.note}
                                        onChange={handleChange}
                                        id='note'
                                    />
                                    <label className="active" htmlFor='amount'>Note </label>
                                </div>
                            </div>
                        </section>
                        {/* <section>
                             <button>add persentage</button>
                            <div className="collection">
                                 Los datos vienen de la base de datos, y en base a lo que el usuario ingrese en el formulario, debe actualizarce cada elemento/divison
                                {/* los datos obtenidos seran los porcentajes, en base a eso hacer la matematica 
                                <a className="collection-item">
                                    <span className="badge">D</span>  {/* Delete percentage 
                                    <span className="badge">280</span>
                                    <span className="badge">15%</span>
                                    Savings
                                </a>
                                <a className="collection-item">
                                    <span className="badge">D</span>  {/* Delete percentage
                                    <span className="badge">120</span>
                                    <span className="badge">10%</span>
                                    Investmet
                                </a>
                                <a className="collection-item">
                                    <span className="badge">D</span>  {/* Delete percentage
                                    <span className="badge">890</span>
                                    <span className="badge">55%</span>
                                    rest
                                </a>
                                <a className="collection-item">
                                    <span className="new pink lighten-2 badge" data-badge-caption='+'></span>  {/* al dar click en este elemento se debe mostrar el modal para agregar porcentage de division
                                    Add Percentage
                                </a>
                            </div>
                            <div className="row disable">  Modal para agregar porcentage
                                <div className="input-field col s12">
                                    <input
                                        name='Category'
                                        type="text"
                                        id='Category'
                                        required
                                        className='validate'
                                        placeholder="Food"
                                    />
                                    <label className="active" htmlFor='Category'>Category *</label>
                                </div>
                                <div className="input-field col s12">
                                    <input
                                        name='Percentage'
                                        type="text"
                                        id='percentage'
                                        required
                                        className='validate'
                                        placeholder="17%"
                                    />
                                    <label className="active" htmlFor='Percentage'>Percentage *</label>
                                </div> 
                                <Submit text={'add Division'} />
                            </div>
                        </section> */}
                        <section>
                            <Submit text='Add Income' />
                        </section>
                    </form>
                </section>
                <section>

                </section>
            </article>
        </>
    )
}