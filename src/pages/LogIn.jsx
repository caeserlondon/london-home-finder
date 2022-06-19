import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import OAuth from '../components/OAuth'

const LogIn = () => {
	const [showPassword, setShowPassword] = useState(false)

	const [formData, setFormData] = useState({
		password: '',
		email: '',
	})

	const { password, email } = formData

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

			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			)

			if (userCredential.user) {
				navigate('/')
			}
		} catch (error) {
			toast.warn('Bad User Name or Password')
		}
	}

	return (
		<>
			<div className='pageContainer'>
				<header>
					<p className='pageHeader'>Welcome back!</p>
				</header>
				<form onSubmit={onSubmit}>
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
							placeholder='Password'
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

					<div className='signInBar'>
						<p className='signInText'>Log In</p>

						<button className='signInButton'>
							<ArrowRightIcon className='arrowRightIcon' />
						</button>
					</div>
				</form>

				<OAuth />

				<Link to='/sign-up' className='registerLink'>
					Don't have an account yet ? Sign Up
				</Link>
			</div>
		</>
	)
}

export default LogIn
