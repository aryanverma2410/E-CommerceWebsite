import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Figure } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'
import loginPic from '../img/loginPic.jpg'

const LoginScreen = ({ location, history }) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const dispatch = useDispatch()

	const userLogin = useSelector((state) => state.userLogin)
	const { loading, error, userInfo } = userLogin

	const redirect = location.search ? location.search.split('=')[1] : '/'

	useEffect(() => {
		if (userInfo) {
			history.push(redirect)
		}
	}, [history, userInfo, redirect])

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(login(email, password))
	}

	return (
		<Row>
			<Col md={6}>
				<center>
					{/* <Figure.Image src={loginPic} alt='Login Image' height='100vh' fluid />
					 */}
					<Figure.Image
						src={loginPic}
						alt='Login'
						width={300}
						height={500}
						fluid
					/>
				</center>
			</Col>

			<Col md={6} className=' py-20'>
				<FormContainer>
					<h1>Sign In</h1>
					{error && <Message variant='danger'>{error}</Message>}
					{loading && <Loader />}
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='email'>
							<Form.Label>Email Address</Form.Label>
							<Form.Control
								type='email'
								placeholder='Enter email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}></Form.Control>
						</Form.Group>

						<Form.Group controlId='password'>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type='password'
								placeholder='Enter password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}></Form.Control>
						</Form.Group>

						<Row className='py-3'>
							<Col md={5}>
								<Button type='submit' variant='primary'>
									Sign In
								</Button>
							</Col>
							<Col md={7} className='my-auto'>
								<Link to={'/reset'}>Forgot Password?</Link>
							</Col>
						</Row>
					</Form>

					<Row className='py-3'>
						<Col>
							New Customer?{' '}
							<Link
								to={redirect ? `/register?redirect=${redirect}` : '/register'}>
								Register
							</Link>
						</Col>
					</Row>
				</FormContainer>
			</Col>
		</Row>
	)
}

export default LoginScreen
