import { useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config.js'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

const Profile = () => {
	const auth = getAuth()

	const [changeDetails, setChangeDetails] = useState(false)

	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	})

	const { name, email } = formData

	const navigate = useNavigate()

	const onLogOut = () => {
		auth.signOut()
		navigate('/')
	}

	const onSubmit = async () => {
		try {
			if (auth.currentUser.displayName !== name) {
				// updating the firebase
				await updateProfile(auth.currentUser, {
					displayName: name,
				})
				// updating the firestore
				const userRef = doc(db, 'users', auth.currentUser.uid)
				await updateDoc(userRef, {
					name,
				})
			}
		} catch (error) {
			toast.error('Could not update profile')
		}
	}

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}))
	}

	return (
		<div className='profile'>
			<header className='profileHeader'>
				<p className='pageHeader'>My Profile</p>
				<button className='logOut' type='button' onClick={onLogOut}>
					Log Out
				</button>
			</header>
			<main>
				<div className='profileDetailsHeader'>
					<p className='profileDetailsText'>Personal Details</p>
					<p
						className='changePersonalDetails'
						onClick={() => {
							changeDetails && onSubmit()
							setChangeDetails((prevState) => !prevState)
						}}
					>
						{changeDetails ? 'done' : 'change'}
					</p>
				</div>
				<div className='profileCard'>
					<form>
						<input
							type='text'
							id='name'
							className={changeDetails ? 'profileNameActive' : 'profileName'}
							disabled={!changeDetails}
							value={name}
							onChange={onChange}
						/>
						<input
							type='text'
							id='email'
							className={changeDetails ? 'profileEmailActive' : 'profileEmail'}
							disabled={!changeDetails}
							value={email}
							onChange={onChange}
						/>
					</form>
				</div>
				<Link to='/create-listing' className='createListing'>
					<img src={homeIcon} alt='home' />
					<p>Sell or rent your property</p>
					<img src={arrowRight} alt='go' />
				</Link>
			</main>
		</div>
	)
}

export default Profile
