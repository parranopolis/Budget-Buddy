import { useState, useContext, useEffect } from "react"
import { useNavigate, Link, useParams, useLocation } from "react-router-dom"

import { auth, db } from "../services/firebaseConfig.ts"
import { addDoc, collection, Timestamp, updateDoc, doc } from "firebase/firestore"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { FirebaseError } from "firebase/app"

import { UserContext, useUserContext } from "../Context/Context.tsx"

import { Submit } from "./Buttons.tsx"
import '../Styles/components/Forms.css'
import '../Styles/main.css'
import { useMemo } from "react"
import { FormatingText } from "../Logic/functions.tsx"
import type { IncomeItem } from "../Context/ExpensesContext.tsx"

export function LoginForm() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loginError, setloginError] = useState<string>('')
    // const { userId, setUserId } = useContext(UserContext)
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
            if(error instanceof FirebaseError) setloginError(error.code)
        }
    }

    return (
        <section className="">
            <form action=''></form>
            <div className="center formError h6">
                <span>{loginError}</span>
            </div>
            <article className="flex flex-col gap-2 mb-8">
                <label className="active" htmlFor="first_name2"></label>
                <input type="text" className="rounded-lg border py-2 px-6 w-full" placeholder="Email..."onChange={(e) => setEmail(e.target.value)}/>
                <label className="active" htmlFor="first_name2"></label>
                <input placeholder="*******" className='rounded-lg border py-2 px-6 w-full'type="password" onChange={(e) => setPassword(e.target.value)}/>
                <span onClick={logIn} className="mt-4">
                    <Submit text="Log In" />
                </span>
            </article>
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
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [sigInError, setSigInError] = useState<string>('')

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
            if( error instanceof FirebaseError) setSigInError(error.code)
        }
    }
    const reRoute = useNavigate()
    return (
        <section className="">
            <div className="center formError h6">
                <span>{sigInError}</span>
            </div>
            <article className="flex flex-col gap-2 mb-8">
                <label className="active" htmlFor="first_name2"></label>
                <input className="border rounded-lg py-2 px-6 w-full" type="text" placeholder="Email..." onChange={(e) => setEmail(e.target.value)}/>
                <label className="active" htmlFor="first_name2"></label>
                <input className="border rounded-lg py-2 px-6 w-full" placeholder="*******" type="password" onChange={(e) => setPassword(e.target.value)}/>
                <span className="mt-4" onClick={singIn}><Submit text="Create Account" /></span>
            </article>
            <div className="">
                <span>Already have one? </span><Link to={`/login`}>Log in</Link>
            </div>
        </section >
    )
}

interface IncomeFormData{
    amount:number;
    date: string;
    from: string;
    note: string;
}

export function AddIncomeForm() {

    const { userId } = useUserContext()
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [todayDate] = useState(()=>{

            // Create a new Date object for today
            const today = new Date();

            // Get year, month, and day
            const year = today.getFullYear();
            // Month is 0-indexed, so add 1
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');

            // Format the date as YYYY-MM-DD
            const formattedDate = `${year}-${month}-${day}`;

            return formattedDate
        })
    const [formData, setFormData] = useState<IncomeFormData>({
        amount: 0,
        date: todayDate,
        from: '',
        note: '',
    })
    const [formError, setFormError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const { id } = useParams<{id : string}>()
    const isEditMode = Boolean(id)
    const { state } = useLocation()
    useEffect(() => {
        if(!isEditMode) return

        setFormData((prev) => ({
            ...prev,
            amount: state.amount ?? '',
            date: state.date ?? todayDate,
            from: state.from ?? '',
            note: state.note ?? '',
        }))
    },[isEditMode, state, todayDate])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const incomeCollectionRef = useMemo(() => {
        if(!userId) return null;
        // const monthKey = (formData.date || todayDate).slice(0,7); // "YYYY-MM"
        // return collection(db, `users/${userId}/monthlyIncome/${monthKey}/incomeItems`);
        return collection(db, "newMonthlyIncome", userId, "incomes");
    },[userId]);

    const sendForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const { amount, date, from, note } = formData
        if (!amount || !date || !from) {
            setFormError('Please fill in all require fields')
            return
        }

        const dateTs = Timestamp.fromDate(new Date(`${date}T00:00:00.000Z`));

        type IncomePayload = Omit<IncomeItem, 'id'>
        
        if (!userId || !incomeCollectionRef || !id) return
        
        const payload: IncomePayload = {
            uid: userId,
            amount: Number(amount),
            date: date,
            from: FormatingText(from),
            note: FormatingText(note),
            time: new Date().toLocaleDateString(),
            dateStr: dateTs,
            monthKey: date.slice(0,7),
        }
        setFormError('')
        setIsSubmitting(true)
        try {
            if(isEditMode){
                await updateDoc(
                    doc(db, 'newMonthlyIncome', userId, 'incomes', id), payload)
                    setSuccessMessage('Income Updated successfully')
            } else {
                await addDoc(incomeCollectionRef, payload)
                setSuccessMessage('Income Added successfully')
            }
            setFormData({
                amount: 0,
                date: todayDate,
                from: '',
                note: '',
            })
        } catch (error) {
            console.log(error)
            setFormError('Failed to add expense. Try again later.')
        }finally{
            setIsSubmitting(false)
        }
    }

    return (
        <>
        <main className="mx-8 my-8">
            <h3 className='text-3xl font-medium'>Add Income</h3>
            <section>
                <article>
                    <br />
                    <span>{formError}</span>
                    <span>{successMessage}</span>
                </article>
                <article>
                    <form action="" id="addIncomeForm" onSubmit={sendForm} className="grid grid-cols-6 gap-4">
                        <div className="col-start-1 col-end-4">
                            <input
                                name='amount'
                                value={formData.amount}
                                onChange={handleChange}
                                type="number"
                                pattern="[0-9]*"
                                inputMode="decimal"
                                id='amount'
                                required
                                className='border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full'
                            placeholder="$ 123.45"
                            />
                            <label className="sr-only" htmlFor='amount'>Amount *</label>
                        </div>
                        <div className="col-start-4 col-end-7">
                            <input
                                name='date'
                                value={formData.date}
                                onChange={handleChange}
                                type="date"
                                id='date'
                                required
                                className='appearance-none block text-gray-400 border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full'
                            />
                            <label className="sr-only" htmlFor='amount'>Date *</label>
                        </div>
                        <div className="col-start-1 col-end-7">
                            <input
                                name='from'
                                value={formData.from}
                                onChange={handleChange}
                                type="text"
                                id='from'
                                required
                                className='border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full'
                                placeholder="Where this money comes from?"
                            />
                            <label className="sr-only" htmlFor='amount'>From *</label>
                        </div>
                        <div className="col-start-1 col-end-7">
                            <input
                                name='note'
                                type="text"
                                value={formData.note}
                                onChange={handleChange}
                                id='note'
                                className="border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full"
                                placeholder="Additional Notes"
                            />
                            <label className="sr-only" htmlFor='amount'>Note </label>
                        </div>
                        
                        <section className="col-start-1 col-end-7">
                            <Submit text={isSubmitting ? "Saving..." : "Send"} disable={isSubmitting} />
                        </section>
                    </form>
                </article>
                <section>

                </section>
            </section>
            </main>
        </>
    )
}