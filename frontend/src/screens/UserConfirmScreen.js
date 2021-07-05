import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { confirmUser, getUserConfirmDetails } from '../actions/userActions'
const UserConfirmScreen = ({ match, history }) => {
	//const userId = match.params.id
	const emailToken = match.params.token
	// const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET_EMAIL)

	// const userId = await User.findById(decoded.id).select('-password')
	// eslint-disable-next-line
	const [name, setName] = useState('')
	// eslint-disable-next-line
	const [email, setEmail] = useState('')
	// eslint-disable-next-line
	const [isConfirmed, setIsConfirmed] = useState(true)

	const dispatch = useDispatch()

	const userDetails = useSelector((state) => state.userDetails)
	const { loading, error, user } = userDetails

	const userConfirm = useSelector((state) => state.userConfirm)
	const {
		loading: loadingConfirm,
		error: errorConfirm,
		success: successConfirm,
	} = userConfirm

	useEffect(() => {
		if (successConfirm) {
			history.push('/login')
		} else {
			if (!emailToken) {
				dispatch(getUserConfirmDetails(emailToken))
			} else {
				setName(user.name)
				setEmail(user.email)
				setIsConfirmed(user.isConfirmed)
			}
		}
	}, [dispatch, history, user, successConfirm, emailToken])

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(confirmUser(emailToken))
		alert(`Your E-mail ID is confirmed!Sign In..`)
		history.push('/login')
	}

	return (
		<>
			<FormContainer>
				<h1>Confirm User</h1>
				{loadingConfirm && <Loader />}
				{errorConfirm && <Message variant='danger'>{errorConfirm}</Message>}
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant='danger'>{error}</Message>
				) : (
					<Form onSubmit={submitHandler}>
						{/* <Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='name'
								placeholder='Enter Name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								readOnly></Form.Control>
						</Form.Group>

						<Form.Group controlId='email'>
							<Form.Label>Email Address</Form.Label>
							<Form.Control
								type='email'
								placeholder='Enter email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								readOnly></Form.Control>
						</Form.Group>

						<Form.Group controlId='isconfirmed'>
							<Form.Check
								type='checkbox'
								label='Do you confirm your Email Id?'
								checked={isConfirmed}
								onChange={(e) => setIsConfirmed(e.target.checked)}></Form.Check>
						</Form.Group> */}

						<Button type='submit' variant='primary'>
							Confirm
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	)
}

export default UserConfirmScreen
