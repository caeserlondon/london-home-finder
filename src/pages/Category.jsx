import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
	limit,
	startAfter,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

const Category = () => {
	const [listings, setListings] = useState(null)

	const [loading, setLoading] = useState(true)

	const params = useParams()

	const onDelete = () => {}

	useEffect(() => {
		const fetchListings = async () => {
			try {
				// Get reference to the collection
				const listingsRef = collection(db, 'listings')

				// Create a query for the listtingsRef
				const q = query(
					listingsRef,
					where('type', '==', params.categoryName),
					orderBy('timestamp', 'desc'),
					limit(10)
				)

				//Execute qury and get the listtings
				const querySnap = await getDocs(q)

				const listings = []

				querySnap.forEach((doc) => {
					// this will give me the Snapshot object that is the docRef.
					// console.log(doc)

					// using the date() method, I can get the date of the listings.
					// console.log(doc.data())
					// I can then use the date() method to get the date of the listings.

					return listings.push({
						id: doc.id,
						data: doc.data(),
					})
				})

				setListings(listings)
				setLoading(false)
			} catch (error) {
				toast.error('Error fetching listings')
			}
		}

		fetchListings()
	}, [params.categoryName])

	return (
		<div className='category'>
			<header>
				<p className='pageHeader'>
					{params.categoryName === 'sale'
						? 'Places for sale'
						: 'Places for rent'}
				</p>
			</header>
			{loading ? (
				<Spinner />
			) : listings && listings.length > 0 ? (
				<>
					<main>
						<ul className='categoryListings'>
							{listings.map((listing) => (
								<ListingItem
									key={listing.id}
									id={listing.id}
									listing={listing.data}
									onDelete={onDelete}
								/>
							))}
						</ul>
					</main>
				</>
			) : (
				<h2>No listings for {params.categoryName}</h2>
			)}
		</div>
	)
}

export default Category
