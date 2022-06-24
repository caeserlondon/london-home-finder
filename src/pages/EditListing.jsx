import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from 'firebase/storage'
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { v4 as uuidv4 } from 'uuid'

const EditListing = () => {
	const [loading, setLoading] = useState(false)

	const [listing, setListing] = useState(false)

	const [formData, setFormData] = useState({
		type: 'rent',
		name: '',
		sqft: 0,
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: '',
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		description: '',
		images: {},
		latitude: 0,
		longitude: 0,
	})

	const {
		type,
		name,
		sqft,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address,
		offer,
		regularPrice,
		discountedPrice,
		description,
		images,
		latitude,
		longitude,
	} = formData

	const auth = getAuth()
	const navigate = useNavigate()
	const isMounted = useRef(true)
	const params = useParams()

	// On submiting the form data
	const onSubmit = async (e) => {
		e.preventDefault()

		setLoading(true)

		if (discountedPrice >= regularPrice) {
			setLoading(false)
			toast.error('Discounted price needs to be less than regular price')
			return
		}

		if (images.length > 6) {
			setLoading(false)
			toast.error('Max 6 images')
			return
		}

		// Handling the location
		let geolocation = {}

		geolocation.lat = latitude
		geolocation.lng = longitude

		// Store image in firebase
		// https://firebase.google.com/docs/storage/web/upload-files?authuser=0
		const storeImage = async (image) => {
			return new Promise((resolve, reject) => {
				const storage = getStorage()
				const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

				const storageRef = ref(storage, 'images/' + fileName)

				const uploadTask = uploadBytesResumable(storageRef, image)

				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100
						console.log('Upload is ' + progress + '% done')
						switch (snapshot.state) {
							case 'paused':
								console.log('Upload is paused')
								break
							case 'running':
								console.log('Upload is running')
								break
							default:
								break
						}
					},
					(error) => {
						reject(error)
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve(downloadURL)
						})
					}
				)
			})
		}

		// calling the storeImage function
		const imgUrls = await Promise.all(
			[...images].map((image) => storeImage(image))
			// Catching the rejection
		).catch(() => {
			setLoading(false)
			toast.error('Images not uploaded')
			return
		})

		// Saving the listings to the database
		const formDataCopy = {
			...formData,
			imgUrls,
			geolocation,
			timestamp: serverTimestamp(),
		}

		// Delete the images and keep the URLs
		delete formDataCopy.images

		// Delete the discountedPrice if no offer is available
		!formDataCopy.offer && delete formDataCopy.discountedPrice

		// Update the listing
		const docRef = doc(db, 'listings', params.listingId)
		await updateDoc(docRef, formDataCopy)

		setLoading(false)
		toast.success('Listing saved')
		navigate(`/category/${formDataCopy.type}/${docRef.id}`)
	}

	// On filling in the form data
	const onMutate = (e) => {
		let boolean = null

		if (e.target.value === 'true') {
			boolean = true
		}
		if (e.target.value === 'false') {
			boolean = false
		}

		// Files
		if (e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				images: e.target.files,
			}))
		}

		// Text/Booleans/Numbers
		if (!e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				[e.target.id]: boolean ?? e.target.value,
			}))
		}
	}
	// setting the userRef from the looged in user
	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					setFormData({ ...formData, userRef: user.uid })
				} else {
					navigate('/login')
				}
			})
		}
		return () => {
			isMounted.current = false
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMounted])

	// For Editing
	useEffect(() => {
		setLoading(true)

		const fetchListing = async () => {
			const docRef = doc(db, 'listings', params.listingId)
			const docSnap = await getDoc(docRef)

			if (docSnap.exists()) {
				setListing(docSnap.data())

				setFormData(docSnap.data())
				setLoading(false)
			} else {
				navigate('/profile')
				toast.error('Listing does not exist')
			}
		}

		fetchListing()
	}, [params.listingId, navigate])

	// For redirecting if the user is not the landlord
	useEffect(() => {
		if (listing && listing.userRef !== auth.currentUser.uid) {
			toast.error('You can not edit the listing')
			navigate('/')
		}
		// eslint-disable-next-line
	}, [auth.currentUser.uid, listing])

	if (loading) {
		return <Spinner />
	}

	return (
		<div className='profile'>
			<header>
				<p className='pageHeader'>Edit the Listing</p>
			</header>

			<main>
				<form onSubmit={onSubmit}>
					<label className='formLabel'>Sell / Rent</label>
					<div className='formButtons'>
						<button
							type='button'
							className={type === 'sale' ? 'formButtonActive' : 'formButton'}
							id='type'
							value='sale'
							onClick={onMutate}
						>
							Sell
						</button>
						<button
							type='button'
							className={type === 'rent' ? 'formButtonActive' : 'formButton'}
							id='type'
							value='rent'
							onClick={onMutate}
						>
							Rent
						</button>
					</div>
					<label className='formLabel'>Name</label>
					<input
						className='formInputName'
						type='text'
						id='name'
						value={name}
						onChange={onMutate}
						maxLength='50'
						minLength='10'
						required
					/>
					<div className='formRooms flex'>
						<div>
							<label className='formLabel'>Bedrooms</label>
							<input
								className='formInputSmall'
								type='number'
								id='bedrooms'
								value={bedrooms}
								onChange={onMutate}
								min='1'
								max='50'
								required
							/>
						</div>
						<div>
							<label className='formLabel'>Bathrooms</label>
							<input
								className='formInputSmall'
								type='number'
								id='bathrooms'
								value={bathrooms}
								onChange={onMutate}
								min='1'
								max='50'
								required
							/>
						</div>
						<div>
							<label className='formLabel'>Sq.Ft</label>
							<input
								className='formInputSmall'
								type='number'
								id='sqft'
								value={sqft}
								onChange={onMutate}
								min='1'
								max='100000'
								required
							/>
						</div>
					</div>
					<label className='formLabel'>Parking spot</label>
					<div className='formButtons'>
						<button
							className={parking ? 'formButtonActive' : 'formButton'}
							type='button'
							id='parking'
							value={true}
							onClick={onMutate}
							min='1'
							max='50'
						>
							Yes
						</button>
						<button
							className={
								!parking && parking !== null ? 'formButtonActive' : 'formButton'
							}
							type='button'
							id='parking'
							value={false}
							onClick={onMutate}
						>
							No
						</button>
					</div>
					<label className='formLabel'>Furnished</label>
					<div className='formButtons'>
						<button
							className={furnished ? 'formButtonActive' : 'formButton'}
							type='button'
							id='furnished'
							value={true}
							onClick={onMutate}
						>
							Yes
						</button>
						<button
							className={
								!furnished && furnished !== null
									? 'formButtonActive'
									: 'formButton'
							}
							type='button'
							id='furnished'
							value={false}
							onClick={onMutate}
						>
							No
						</button>
					</div>
					<label className='formLabel'>Description</label>

					<textarea
						className='formInputDescription'
						type='text'
						id='description'
						value={description}
						onChange={onMutate}
						required
					/>
					<label className='formLabel'>Address</label>
					<p>
						To get the full address use
						https://www.royalmail.com/find-a-postcode
					</p>
					<textarea
						className='formInputAddress'
						type='text'
						id='address'
						value={address}
						onChange={onMutate}
						required
					/>
					<p>
						To get the Latitude and Longitude use
						https://gridreferencefinder.com/postcodeBatchConverter/
					</p>
					<div className='formLatLng flex'>
						<div>
							<label className='formLabel'>Latitude</label>
							<input
								className='formInputSmall'
								type='number'
								id='latitude'
								value={latitude}
								onChange={onMutate}
								required
							/>
						</div>
						<div>
							<label className='formLabel'>Longitude</label>
							<input
								className='formInputSmall'
								type='number'
								id='longitude'
								value={longitude}
								onChange={onMutate}
								required
							/>
						</div>
					</div>
					<label className='formLabel'>Offer</label>
					<div className='formButtons'>
						<button
							className={offer ? 'formButtonActive' : 'formButton'}
							type='button'
							id='offer'
							value={true}
							onClick={onMutate}
						>
							Yes
						</button>
						<button
							className={
								!offer && offer !== null ? 'formButtonActive' : 'formButton'
							}
							type='button'
							id='offer'
							value={false}
							onClick={onMutate}
						>
							No
						</button>
					</div>
					<label className='formLabel'>Regular Price</label>
					<div className='formPriceDiv'>
						<input
							className='formInputSmall'
							type='number'
							id='regularPrice'
							value={regularPrice}
							onChange={onMutate}
							min='50'
							max='100000000'
							required
						/>
						{type === 'rent' && (
							<p className='formPriceText'> £ Per calendar month</p>
						)}
					</div>
					{offer && (
						<>
							<label className='formLabel'>Discounted Price</label>
							<input
								className='formInputSmall'
								type='number'
								id='discountedPrice'
								value={discountedPrice}
								onChange={onMutate}
								min='50'
								max='100000000'
								required={offer}
							/>
						</>
					)}
					<label className='formLabel'>Images</label>
					<p className='imagesInfo'>
						The first image will be the cover (max 6). Hold down the (Ctrl key
						on Windows and command key on Mac). on your keyboard and using your
						trackpad or external mouse, click on all the other files you wish to
						select one by one
					</p>
					<input
						className='formInputFile'
						type='file'
						id='images'
						onChange={onMutate}
						max='6'
						accept='.jpg,.png,.jpeg,.webp'
						multiple
						required
					/>
					<button type='submit' className='primaryButton createListingButton'>
						Edit Listing
					</button>
				</form>
			</main>
		</div>
	)
}

export default EditListing
