import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

// https://stackoverflow.com/questions/67552020/how-to-fix-error-failed-to-compile-node-modules-react-leaflet-core-esm-pat

function Listing() {
	const [listing, setListing] = useState(null)
	const [loading, setLoading] = useState(true)
	const [shareLinkCopied, setShareLinkCopied] = useState(false)
	const navigate = useNavigate()
	const params = useParams()
	const auth = getAuth()

	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, 'listings', params.listingId)
			const docSnap = await getDoc(docRef)

			if (docSnap.exists()) {
				// console.log(docSnap.data())
				setListing(docSnap.data())
				setLoading(false)
			}
		}

		fetchListing()
	}, [navigate, params.listingId])

	if (loading) {
		return <Spinner />
	}

	return (
		<div className='mainContainer'>
			<div className='pageContainer'>
				<main>
					<div className='wrapper'>
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
							{listing.imgUrls.map((url, index) => {
								return (
									<SplideSlide key={index}>
										<div className='spliderSlideDiv'>
											<img src={url} alt='' className='splideSlideImg' />
										</div>
									</SplideSlide>
								)
							})}
						</Splide>
					</div>
					<div
						className='shareIconDiv'
						onClick={() => {
							navigator.clipboard.writeText(window.location.href)
							setShareLinkCopied(true)
							// to allow time to display the "link copied"
							setTimeout(() => {
								setShareLinkCopied(false)
							}, 2000)
						}}
					>
						<img src={shareIcon} alt='share' className='shareIconImg' />
					</div>
					{shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}
					<div className='listingDetails'>
						<p className='listingName'>
							{listing.name} - £
							{listing.offer
								? listing.discountedPrice
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
								: listing.regularPrice
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						</p>
						<p className='listingLocation'>{listing.address}</p>
						<p className='listingType'>
							For {listing.type === 'rent' ? 'Rent' : 'Sale'}
						</p>
						{listing.offer && (
							<p className='discountPrice'>
								£
								{(listing.regularPrice - listing.discountedPrice)
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
								discount
							</p>
						)}

						<ul className='listingDetailsList'>
							<li>
								{listing.bedrooms > 1
									? `${listing.bedrooms} Bedrooms`
									: '1 Bedroom'}
							</li>
							<li>
								{listing.bathrooms > 1
									? `${listing.bathrooms} Bathrooms`
									: '1 Bathroom'}
							</li>
							<li>{listing.parking && 'Parking Spot'}</li>
							<li>{listing.furnished && 'Furnished'}</li>
						</ul>
						<p>{listing.description}</p>

						<p className='listingLocationTitle'>Location</p>

						<div className='leafletContainer'>
							<MapContainer
								style={{ height: '100%', width: '100%' }}
								center={[listing.geolocation.lat, listing.geolocation.lng]}
								zoom={13}
								scrollWheelZoom={false}
							>
								<TileLayer
									attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
									url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
								/>

								<Marker
									position={[listing.geolocation.lat, listing.geolocation.lng]}
								>
									<Popup>{listing.address}</Popup>
								</Marker>
							</MapContainer>
						</div>

						{auth.currentUser?.uid !== listing.userRef && (
							<Link
								to={`/contact/${listing.userRef}?listingName=${listing.name}`}
								className='primaryButton'
							>
								Contact Landlord
							</Link>
						)}
					</div>
				</main>
			</div>
		</div>
	)
}

export default Listing
