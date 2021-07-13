import React, { useState, useEffect } from 'react'
import {
	Table,
	Form,
	Button,
	Row,
	Col,
	ListGroup,
	Figure,
} from 'react-bootstrap'
import { LinkContainer, Link } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
	createProductWishlist,
	getUserDetails,
	resendConfirmationEmail,
	updateUserProfile,
} from '../actions/userActions'
import { listMyOrders } from '../actions/orderActions'
import {
	USER_CREATE_WISHLIST_FAIL,
	USER_CREATE_WISHLIST_REQUEST,
	USER_CREATE_WISHLIST_RESET,
	USER_UPDATE_PROFILE_RESET,
} from '../constants/userConstants'
import { listProducts } from '../actions/productActions'
import Product from '../components/Product'
import Rating from '../components/Rating'

const WishlistScreen = ({ location, history }) => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	// const [password, setPassword] = useState('')
	// const [confirmPassword, setConfirmPassword] = useState('')
	const [message, setMessage] = useState(null)
	// eslint-disable-next-line
	const [isConfirmed, setIsConfirmed] = useState(false)

	const dispatch = useDispatch()

	const userDetails = useSelector((state) => state.userDetails)
	const { loading, error, user } = userDetails

	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

	const productList = useSelector((state) => state.productList)
	const {
		loading: loadingProduct,
		error: errorProduct,
		products,
		page,
		pages,
	} = productList

	const userWishlistCreate = useSelector((state) => state.userWishlistCreate)
	const {
		success,
		loading: loadingUserWishlist,
		error: errorUserWishlist,
	} = userWishlistCreate

	useEffect(() => {
		if (!userInfo) {
			history.push('/login')
		}
		if (!user || !user.name) {
			dispatch(getUserDetails('profile'))
			dispatch(listProducts('', 1))
			console.log('useEffect')
			dispatch({ type: USER_CREATE_WISHLIST_RESET })
		}
		if (success) {
			dispatch(getUserDetails('profile'))
			dispatch({ type: USER_CREATE_WISHLIST_RESET })
		}

		// if (successUserWishlist) {
		// 	dispatch(getUserDetails('profile'))
		// 	dispatch(listProducts('', 1))
		// }
	}, [dispatch, history, user, userInfo, success])

	const deleteHandler = (productId) => {
		dispatch(createProductWishlist(user._id, productId))
		dispatch(getUserDetails('profile'))
		dispatch({ type: USER_CREATE_WISHLIST_RESET })
		// dispatch(listProducts('', 1))
		console.log('deletehandler')
	}

	return (
		<Row>
			<Col md={3}>
				<h2>User Wishlist</h2>
				{message && <Message variant='danger'>{message}</Message>}

				{errorUserWishlist && (
					<Message variant='danger'>{errorUserWishlist}</Message>
				)}
				{}
			</Col>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<>
					{user.wishlists.length === 0 && <Message>No wishlists</Message>}
					<ListGroup variant='flush'>
						{user.wishlists.map((wishlist) => (
							<ListGroup.Item key={wishlist._id}>
								<Row>
									{products
										.filter((product) => product.name === wishlist.name)
										.map((product) => (
											<Row>
												<Col md={2}>
													<Figure.Image
														className='mx-5'
														src={product.image}
														alt={product.name}
														width={100}
														height={50}
														fluid
													/>
												</Col>
												<Col md={4}>
													<Row>{product.name}</Row>
													<Row>
														<Col>${product.price}</Col>
														<Col>
															Item added {wishlist.createdAt.substring(0, 10)}
														</Col>
													</Row>
													<Row>
														<Rating
															value={product.rating}
															text={`${product.numReviews} reviews.`}
														/>
													</Row>
												</Col>
												<Col md={2} className=' my-auto '>
													<LinkContainer to={`/product/${product._id}`}>
														<Button className='mx-auto'> Details</Button>
													</LinkContainer>
												</Col>
												<Col md={2} className='my-auto'>
													{product.countInStock >= 1 ? (
														<LinkContainer to={`/cart/${product._id}?qty=1`}>
															<Button>Add to Cart</Button>
														</LinkContainer>
													) : (
														<Button disabled>Add to Cart</Button>
													)}
												</Col>
												<Col md={2} className='my-auto'>
													<Button
														variant='danger'
														className='btn-sm'
														onClick={() => deleteHandler(product._id)}>
														<i className='fas fa-trash'></i>
													</Button>
												</Col>
											</Row>
										))}
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				</>
			)}
			{/*****************TO SHOW WISHLIST ITEMS******************************/}
		</Row>
	)
}

export default WishlistScreen
