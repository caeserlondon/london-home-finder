import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Explore from './pages/Explore'
import ForgotPassword from './pages/ForgotPassword'
import Login from './pages/LogIn'
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import Category from './pages/Category'
import CreateListing from './pages/CreateListing'
import Listing from './pages/Listing'
import Contact from './pages/contact'
import EditListing from './pages/EditListing'
import About from './pages/About'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

function App() {
	return (
		<>
			<Router>
				<Navbar />
				<Routes>
					<Route path='/' element={<Explore />} />
					<Route path='/category/:categoryName' element={<Category />} />
					<Route path='/offers' element={<Offers />} />
					<Route path='/about' element={<About />} />
					<Route path='/profile' element={<PrivateRoute />}>
						<Route path='/profile' element={<Profile />} />
					</Route>
					<Route path='/log-in' element={<Login />} />
					<Route path='/sign-up' element={<SignUp />} />
					<Route path='/forgot-password' element={<ForgotPassword />} />
					<Route path='/create-listing' element={<CreateListing />} />
					<Route path='/edit-listing/:listingId' element={<EditListing />} />
					<Route path='/contact/:landlordId' element={<Contact />} />
					<Route
						path='/category/:categoryName/:listingId'
						element={<Listing />}
					/>
				</Routes>
			</Router>
			<ToastContainer />
		</>
	)
}

export default App
