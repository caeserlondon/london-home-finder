import { useNavigate, useLocation } from 'react-router-dom'
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'
import { ReactComponent as PersonOutLineIcon } from '../assets/svg/personOutlineIcon.svg'

const Navbar = () => {
	let navigate = useNavigate()
	let location = useLocation()

	const pathMatchRoute = (route) => {
		if (route === location.pathname) {
			return true
		}
	}

	return (
		<footer className='navbar'>
			<nav className='navbarNav'>
				<ul className='navbarListItems'>
					<li className='navbarListItem' onClick={() => navigate('/')}>
						<ExploreIcon
							className='exploreIcon'
							fill={
								pathMatchRoute('/')
									? 'var(--primary-color)'
									: 'var(--secondary-color)'
							}
						/>
						<p
							className={
								pathMatchRoute('/')
									? 'navbarListItemNameActive'
									: 'navbarListItemName'
							}
						>
							Explore
						</p>
					</li>
					<li className='navbarListItem' onClick={() => navigate('/offers')}>
						<OfferIcon
							className='offerIcon'
							fill={
								pathMatchRoute('/offers')
									? 'var(--primary-color)'
									: 'var(--secondary-color)'
							}
						/>
						<p
							className={
								pathMatchRoute('/offers')
									? 'navbarListItemNameActive'
									: 'navbarListItemName'
							}
						>
							Offers
						</p>
					</li>
					<li className='navbarListItem' onClick={() => navigate('/profile')}>
						<PersonOutLineIcon
							className='profileIcon'
							fill={
								pathMatchRoute('/profile')
									? 'var(--primary-color)'
									: 'var(--secondary-color)'
							}
						/>
						<p
							className={
								pathMatchRoute('/profile')
									? 'navbarListItemNameActive'
									: 'navbarListItemName'
							}
						>
							Profile
						</p>
					</li>
				</ul>
			</nav>
		</footer>
	)
}

export default Navbar
