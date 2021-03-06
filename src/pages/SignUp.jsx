import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config.js'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import OAuth from '../components/OAuth.jsx'

const SignUp = () => {
	const [showPassword, setShowPassword] = useState(false)

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
	})

	const { name, password, email } = formData

	const navigate = useNavigate()

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}))
	}

	const onSubmit = async (e) => {
		e.preventDefault()

		try {
			const auth = getAuth()

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			)

			const user = userCredential.user

			updateProfile(auth.currentUser, {
				displayName: name,
			})

			const formDataCopy = { ...formData }
			delete formDataCopy.password
			formDataCopy.timestamp = serverTimestamp()

			await setDoc(doc(db, 'users', user.uid), formDataCopy)

			navigate('/')
		} catch (error) {
			toast.error('Bad User Name or Password')
		}
	}

	return (
		<>
			<div className='mainContainer'>
				<div className='pageContainer'>
					<header>
						<p className='pageHeader'>London Home Finder</p>
					</header>
					<form onSubmit={onSubmit}>
						<input
							type='text'
							id='name'
							placeholder='Name'
							className='nameInput'
							value={name}
							onChange={onChange}
							autoComplete='current-username'
						/>
						<input
							type='email'
							id='email'
							placeholder='Email'
							className='emailInput'
							value={email}
							onChange={onChange}
							autoComplete='current-email'
						/>
						<div className='passwordInputDiv'>
							<input
								type={showPassword ? 'text' : 'password'}
								placeholder='Password (6+ characters)'
								onChange={onChange}
								className='passwordInput'
								id='password'
								value={password}
								autoComplete='current-password'
							/>
							<img
								src={visibilityIcon}
								alt='visibility'
								className='showPassword'
								onClick={() => setShowPassword((prevState) => !prevState)}
							/>
						</div>
						<Link to='/forgot-password' className='forgotPasswordLink'>
							Forgot Password ?
						</Link>

						<div className='signUpBar'>
							<p className='signUpText'>Sign Up</p>

							<button className='signUpButton'>
								<ArrowRightIcon className='arrowRightIcon' />
							</button>
						</div>
					</form>

					<OAuth />

					<Link to='/log-in' className='registerLink'>
						Already registered ? Log In Instead
					</Link>
				</div>
			</div>
		</>
	)
}

export default SignUp
