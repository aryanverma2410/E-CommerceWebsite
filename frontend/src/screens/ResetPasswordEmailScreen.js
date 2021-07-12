import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Figure } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { sendPasswordResetEmail } from '../actions/userActions'
import loginPic from '../img/loginPic.jpg'

const ResetPasswordMailScreen = ({ history }) => {
	const [email, setEmail] = useState('')

	const dispatch = useDispatch()

	const sendResetEmail = useSelector((state) => state.sendResetEmail)
	const { loading, error, success, userInfo } = sendResetEmail

	useEffect(() => {}, [history, userInfo, success])

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(sendPasswordResetEmail(email))
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
					<h1>Forgot Password</h1>
					{error && <Message variant='danger'>{error}</Message>}
					{success && (
						<Message variant='success'>Reset password mail sent!</Message>
					)}
					{loading && <Loader />}
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='email'>
							<Form.Label>Enter Email linked with you account</Form.Label>
							<Form.Control
								type='email'
								placeholder='Enter email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}></Form.Control>
						</Form.Group>

						<Button type='submit' variant='primary' className='my-3'>
							Send Reset Link
						</Button>
					</Form>
				</FormContainer>
			</Col>
		</Row>
	)
}

export default ResetPasswordMailScreen
