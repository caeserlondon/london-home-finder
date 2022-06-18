import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

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

	return (
		<>
			<div className='pageContainer'>
				<header>
					<p className='pageHeader'>London Home Finder</p>
				</header>
				<form>
					<input
						type='text'
						id='name'
						placeholder='Name'
						className='nameInput'
						value={name}
						onChange={onChange}
					/>
					<input
						type='email'
						id='email'
						placeholder='Email'
						className='emailInput'
						value={email}
						onChange={onChange}
					/>
					<div className='passwordInputDiv'>
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder='Password'
							onChange={onChange}
							className='passwordInput'
							id='password'
							value={password}
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

				<Link to='/log-in' className='registerLink'>
					Log In Instead
				</Link>
			</div>
		</>
	)
}

export default SignUp
