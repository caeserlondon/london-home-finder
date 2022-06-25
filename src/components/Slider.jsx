import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import Spinner from './Spinner'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

function Slider() {
	const [loading, setLoading] = useState(true)
	const [listings, setListings] = useState(null)

	const navigate = useNavigate()

	useEffect(() => {
		const fetchListings = async () => {
			const listingsRef = collection(db, 'listings')
			const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(6))
			const querySnap = await getDocs(q)

			let listings = []

			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				})
			})

			setListings(listings)
			setLoading(false)
		}

		fetchListings()
	}, [])

	if (loading) {
		return <Spinner />
	}

	if (listings.length === 0) {
		return <></>
	}

	return (
		listings && (
			<>
				<p className='exploreHeading'>Our Most Recent Properties</p>
				<Splide
					options={{
						perPage: 3,
						gap: '20px',
						rewind: true,
						rewindSpeed: 1000,
						arrows: true,
						drag: 'false',
						pagination: true,
						autoplay: true,
					}}
				>
					{listings.map(({ data, id }) => (
						<SplideSlide key={id}>
							<img
								src={data.imgUrls[0]}
								alt=''
								className='splideSlideImg'
								onClick={() => navigate(`/category/${data.type}/${id}`)}
							/>

							<p className='splideSlideText'>{data.name}</p>
							<p className='splideSlidePrice'>
								£ {data.discountedPrice ?? data.regularPrice}
								{data.type === 'rent' && '/ month'}
							</p>
						</SplideSlide>
					))}
				</Splide>
			</>
		)
	)
}

export default Slider
