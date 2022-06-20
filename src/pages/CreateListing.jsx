import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'

const CreateListing = () => {
	const [loading, setLoading] = useState(false)
	const [geoLoactionEnabled, setGeoLocationEnabled] = useState(false)

	const [formData, setFormData] = useState({
		type: 'rent',
		name: '',
		sqft: 0,
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		location: '',
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		images: {},
		latitude: 0,
		logitude: 0,
	})

	const auth = getAuth()
	const navigate = useNavigate()
	const isMounted = useRef(true)

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

	if (loading) {
		return <Spinner />
	}

	return <div>CreateListing</div>
}

export default CreateListing
