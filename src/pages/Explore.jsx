import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import saleCategoryImage from '../assets/jpg/saleCategoryImage.jpg'

const Explore = () => {
	return (
		<div className='explore'>
			<header>
				<p className='pageHeader'>Explore Our Listings</p>
			</header>

			<main>
				{/* Slider */}

				<p className='exploreCategoryHeading'>Categories</p>
				<div className='exploreCategories'>
					<Link to={`/category/rent`}>
						<img
							src={rentCategoryImage}
							alt='rent'
							className='exploreCategoryImg'
						/>
						<p className='exploreCategoryName'>Places for rent</p>
					</Link>
					<Link to={`/category/sale`}>
						<img
							src={saleCategoryImage}
							alt='sale'
							className='exploreCategoryImg'
						/>
						<p className='exploreCategoryName'>Places for sale</p>
					</Link>
				</div>
			</main>
		</div>
	)
}

export default Explore
