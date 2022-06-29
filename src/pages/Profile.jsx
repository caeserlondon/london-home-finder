import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import {
	updateDoc,
	doc,
	collection,
	getDocs,
	query,
	where,
	orderBy,
	deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase.config.js'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem.jsx'

const Profile = () => {
	const auth = getAuth()

	const [changeDetails, setChangeDetails] = useState(false)

	const [loading, setLoading] = useState(true)
	const [listings, setListings] = useState(null)

	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	})

	const { name, email } = formData

	const navigate = useNavigate()

	useEffect(() => {
		const fetchUserListings = async () => {
			const listingsRef = collection(db, 'listings')

			const q = query(
				listingsRef,
				where('userRef', '==', auth.currentUser.uid),
				orderBy('timestamp', 'desc')
			)

			const querySnap = await getDocs(q)

			const listings = []

			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				})
			})

			setListings(listings)
			setLoading(false)
		}

		fetchUserListings()
	}, [auth.currentUser.uid])

	const onLogOut = () => {
		auth.signOut()
		navigate('/log-in')
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

	const onDelete = async (listingId) => {
		if (window.confirm('Are you sure you want to delete?')) {
			await deleteDoc(doc(db, 'listings', listingId))
			const updatedListings = listings.filter(
				(listing) => listing.id !== listingId
			)
			setListings(updatedListings)
			toast.success('Successfully deleted listing')
		}
	}

	const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

	return (
		<div className='mainContainer'>
			<div className='profile profileContainer'>
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
							{changeDetails ? 'done' : 'change user name'}
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
								className={
									changeDetails ? 'profileEmailActive' : 'profileEmail'
								}
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

					{!loading && listings?.length > 0 && (
						<>
							<p className='listingText'>Your Listings</p>
							<ul className='listingsList'>
								{listings.map((listing) => (
									<ListingItem
										key={listing.id}
										listing={listing.data}
										id={listing.id}
										onDelete={() => onDelete(listing.id)}
										onEdit={() => onEdit(listing.id)}
									/>
								))}
							</ul>
						</>
					)}
				</main>
			</div>
		</div>
	)
}

export default Profile
