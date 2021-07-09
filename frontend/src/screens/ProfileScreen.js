import React, { useState, useEffect } from 'react'
import { Table, Form, Button, Row, Col, ListGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
	getUserDetails,
	resendConfirmationEmail,
	updateUserProfile,
} from '../actions/userActions'
import { listMyOrders } from '../actions/orderActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

const ProfileScreen = ({ location, history }) => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [message, setMessage] = useState(null)
	// eslint-disable-next-line
	const [isConfirmed, setIsConfirmed] = useState(false)

	const dispatch = useDispatch()

	const userDetails = useSelector((state) => state.userDetails)
	const { loading, error, user } = userDetails

	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

	const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
	const { success } = userUpdateProfile

	const userConfirm = useSelector((state) => state.userConfirm)
	const { success: successConfirm } = userConfirm

	const resendConfirmEmail = useSelector((state) => state.resendConfirmEmail)
	const {
		loading: loadingResend,
		error: errorResend,
		success: successResend,
	} = resendConfirmEmail

	const orderListMy = useSelector((state) => state.orderListMy)
	const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

	useEffect(() => {
		if (!userInfo) {
			history.push('/login')
		} else {
			if (!user || !user.name || success) {
				dispatch({ type: USER_UPDATE_PROFILE_RESET })
				dispatch(getUserDetails('profile'))
				dispatch(listMyOrders())
			} else {
				setName(user.name)
				setEmail(user.email)
				setIsConfirmed(user.isConfirmed)
			}
		}
	}, [dispatch, history, userInfo, user, success, successConfirm])

	const submitHandler = (e) => {
		e.preventDefault()
		if (password !== confirmPassword) {
			setMessage('Passwords do not match')
		} else {
			dispatch(updateUserProfile({ id: user._id, name, email, password }))
		}
	}
	const resendHandler = (id) => {
		//if (window.confirm('Are you sure?')) {
		dispatch(resendConfirmationEmail(user))
		//}
	}

	return (
		<Row>
			<Col md={3}>
				<h2>User Profile</h2>
				{message && <Message variant='danger'>{message}</Message>}
				{}
				{success && <Message variant='success'>Profile Updated</Message>}
				{successResend && (
					<Message variant='success'>Verification Mail sent.</Message>
				)}
				{errorResend && <Message variant='danger'>{errorResend}</Message>}

				{loading ? (
					<Loader />
				) : error ? (
					<Message variant='danger'>{error}</Message>
				) : (
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='name'
								placeholder='Enter name'
								value={name}
								onChange={(e) => setName(e.target.value)}></Form.Control>
						</Form.Group>

						<Form.Group controlId='email'>
							<Form.Label>Email Address</Form.Label>
							{user.isConfirmed ? (
								<Form.Control
									className={'form-control is-valid'}
									type='email'
									placeholder='Enter email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									readOnly></Form.Control>
							) : (
								<Form.Control
									className={'form-control is-invalid'}
									type='email'
									placeholder='Enter email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}></Form.Control>
							)}
							{user.isConfirmed ? (
								<i style={{ color: 'green' }}>Verified</i>
							) : (
								<i style={{ color: 'red' }}>
									{loadingResend ? (
										<Loader />
									) : (
										<Button
											className='btn btn-sm'
											variant='outline-danger'
											onClick={resendHandler}>
											Resend Verification Mail
										</Button>
									)}
								</i>
							)}
						</Form.Group>

						<Form.Group controlId='password'>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type='password'
								placeholder='Enter password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}></Form.Control>
						</Form.Group>

						<Form.Group controlId='confirmPassword'>
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control
								type='password'
								placeholder='Confirm password'
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}></Form.Control>
						</Form.Group>

						<Button type='submit' variant='primary'>
							Update
						</Button>
					</Form>
				)}
			</Col>
			<Col md={9}>
				<h2>My Orders</h2>
				{loadingOrders ? (
					<Loader />
				) : errorOrders ? (
					<Message variant='danger'>{errorOrders}</Message>
				) : (
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>DATE</th>
								<th>TOTAL</th>
								<th>PAID</th>
								<th>DELIVERED</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr key={order._id}>
									<td>{order._id}</td>
									<td>{order.createdAt.substring(0, 10)}</td>
									<td>{order.totalPrice}</td>
									<td>
										{order.isPaid ? (
											order.paidAt.substring(0, 10)
										) : (
											<i className='fas fa-times' style={{ color: 'red' }}></i>
										)}
									</td>
									<td>
										{order.isDelivered ? (
											order.deliveredAt.substring(0, 10)
										) : (
											<i className='fas fa-times' style={{ color: 'red' }}></i>
										)}
									</td>
									<td>
										<LinkContainer to={`/order/${order._id}`}>
											<Button className='btn-sm' variant='light'>
												Details
											</Button>
										</LinkContainer>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</Col>
			{/* {loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<>
					{user.wishlists.length === 0 && <Message>No wishlists</Message>}
					<ListGroup variant='flush'>
						{user.wishlists.map((wishlist) => (
							<ListGroup.Item key={wishlist._id}>
								<strong>{wishlist.name}</strong>
								<p>{wishlist.createdAt.substring(0, 10)}</p>
							</ListGroup.Item>
						))}
					</ListGroup>
				</>
			)} */}
			{/*****************TO SHOW WISHLIST ITEMS******************************/}
		</Row>
	)
}

export default ProfileScreen
