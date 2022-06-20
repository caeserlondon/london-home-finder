import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

const OAuth = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const onGoogleClick = async () => {
		try {
			const auth = getAuth()
			const provider = new GoogleAuthProvider()
			const result = await signInWithPopup(auth, provider)
			const user = result.user

			//check if user is authenticated
			const docRef = doc(db, 'users', user.uid)
			const docSnap = await getDoc(docRef)

			// if user does not exist, create user
			if (!docSnap.exists()) {
				await setDoc(doc(db, 'users', user.uid), {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				})
			}
			navigate('/')
		} catch (error) {
			toast.error('Could not authorize with Google')
		}
	}

	return (
		<div className='socialLogin'>
			<p>{location.pathname === '/log-in' ? 'Log In' : 'Sign Up'} With </p>
			<button className='socialIconDiv' onClick={onGoogleClick}>
				<img src={googleIcon} alt='Google' className='socialIconImg' />
			</button>
		</div>
	)
}

export default OAuth
