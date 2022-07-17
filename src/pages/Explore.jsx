import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import saleCategoryImage from '../assets/jpg/saleCategoryImage.jpg'
import SliderSale from '../components/SliderSale'
import SliderRent from '../components/SliderRent'

const Explore = () => {
	return (
		<div className='mainContainer'>
			<div className='explore'>
				<header>
					<p className='pageHeader'>Explore Our Listings</p>
				</header>

				<main>
					<SliderSale />
					<SliderRent />
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
					<div>
						<hr />
						<h4>
							To be able to post your property you need to have an account.
						</h4>
						<h5>
							Use: sample@gmail.com and password: 123456 if you don't want to
							register but want to check out the functionality.
						</h5>
					</div>
				</main>
			</div>
		</div>
	)
}

export default Explore
