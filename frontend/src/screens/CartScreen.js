import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
	Row,
	Col,
	Image,
	Button,
	Card,
	ListGroup,
	Table,
} from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'
import Loader from '../components/Loader.js'
import { listPackagings } from '../actions/packagingActions'

const CartScreen = ({ match, location, history }) => {
	const productId = match.params.id

	const qty = location.search ? Number(location.search.split('=')[1]) : 1
	const packagingType = '0'

	const dispatch = useDispatch()

	const cart = useSelector((state) => state.cart)
	const { cartItems } = cart

	console.log(cartItems)

	const packagingList = useSelector((state) => state.packagingList)
	const {
		loading: loadingPackagingList,
		error: errorPackagingList,
		packagings,
	} = packagingList

	useEffect(() => {
		dispatch(listPackagings('', 1))
		if (productId) {
			dispatch(addToCart(productId, qty, packagingType))
		}
	}, [dispatch, productId, qty, packagingType])

	const removeFromCartHandler = (id) => {
		dispatch(removeFromCart(id))
	}
	const checkoutHandler = () => {
		history.push('/login?redirect=shipping')
	}

	return (
		<Row>
			<Col md={8}>
				<h1>Shopping Cart</h1>
				{cartItems.length === 0 ? (
					<Message>
						Your cart is empty. <Link to='/'> Go Back</Link>
					</Message>
				) : (
					<ListGroup variant='flush'>
						{cartItems.map((item) => (
							<ListGroup.Item key={item.product}>
								<Row>
									<Col md={2}>
										<Image
											src={item.image}
											alt={item.name}
											fluid
											roundedCircle
										/>
									</Col>

									<Col className='py-3'>
										<Link to={`/product/${item.product}`}>{item.name}</Link>
									</Col>
									<Col className='py-3'>${item.price}</Col>
								</Row>
								<Row>
									<Col>
										<select
											class='form-select'
											value={item.qty}
											onChange={(e) =>
												dispatch(
													addToCart(
														item.product,
														Number(e.target.value),
														packagingType
													)
												)
											}>
											{[...Array(item.countInStock).keys()].map((x) => (
												<option key={x + 1} value={x + 1}>
													{x + 1}
												</option>
											))}
										</select>
									</Col>
									<Col>
										<select
											class='form-select'
											value={item.packagingType}
											onChange={(e) =>
												dispatch(
													addToCart(item.product, qty, String(e.target.value))
												)
											}>
											{packagings.map((packaging) => (
												<option
													key={packaging._id}
													value={Number(packaging.price)}>
													{`$ ${packaging.price}-${packaging.name}`}
												</option>
											))}
										</select>
										{/* {packagings.map((packaging) => (
												<Form.Check
													type='radio'
													label={packaging.name}
													id={packaging._id}
													name='PackagingType'
													value={packaging.name}
													onChange={(e) =>
														dispatch(
															addToCart(
																item.product,
																qty,
																String(e.target.value)
															)
														)
													}></Form.Check>
											))} */}
									</Col>

									<Col md={2}>
										<Button
											type='button'
											variant='light'
											onClick={() => removeFromCartHandler(item.product)}>
											<i className='fas fa-trash'></i>
										</Button>
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
			</Col>
			<Col md={4}>
				<Card>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>
								Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
								items
							</h2>
							$
							{cartItems
								.reduce((acc, item) => acc + item.qty * item.price, 0)
								.toFixed(2)}
						</ListGroup.Item>
						<Button
							type='button'
							className='btn-block'
							disabled={cartItems.length === 0}
							onClick={checkoutHandler}>
							Proceed to Checkout
						</Button>
					</ListGroup>
				</Card>
			</Col>
			<Col>
				{loadingPackagingList ? (
					<Loader />
				) : errorPackagingList ? (
					<Message variant='danger'>{errorPackagingList}</Message>
				) : (
					<>
						<Table striped bordered hover responsive className='table-sm'>
							<thead>
								<tr>
									<th>IMAGE</th>
									<th>NAME</th>
									<th>PRICE</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{packagings.map((packaging) => (
									<tr key={packaging._id} md={1}>
										<td>
											<Image
												src={packaging.image}
												alt={packaging.name}
												fluid
												rounded
											/>
										</td>
										<td>{packaging.name}</td>
										<td>${packaging.price}</td>
									</tr>
								))}
							</tbody>
						</Table>
					</>
				)}
			</Col>
		</Row>
	)
}

export default CartScreen
//] GET /api/packagings?keyword=&pageNumber=1
//] GET /api/packagings?keyword=&pageNumber=1
//] GET /api/packagings?keyword=&pageNumber=1
