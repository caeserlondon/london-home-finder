import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

const ForgotPassword = () => {
	const [email, setEmail] = useState('')

	const onChange = (e) => setEmail(e.target.value)

	const onSubmit = async (e) => {
		e.preventDefault()
		try {
			const auth = getAuth()

			await sendPasswordResetEmail(auth, email)

			toast.warn('Please check your email for a password reset link!')
			toast.warn('please check your spam or junk mail folder')
		} catch (error) {
			toast.warn('Error sending email!')
		}
	}

	return (
		<div className='pageContainer'>
			<header>
				<p className='pageHeader'>Forgot Password</p>
			</header>
			<main>
				<form onSubmit={onSubmit}>
					<input
						type='email'
						placeholder='Email '
						className='emailInput'
						autoComplete='current-email'
						value={email}
						id='email'
						onChange={onChange}
					/>
					<Link to='/log-in' className='forgotPasswordLink'>
						Log In
					</Link>
					<div className='signInBar'>
						<div className='signInText'>Send Reset Email</div>
						<p>please check your spam or junk mail folder</p>
						<button className='signInButton'>
							<ArrowRightIcon className='arrowRightIcon' />
						</button>
					</div>
				</form>
			</main>
		</div>
	)
}

export default ForgotPassword
