import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import {
	getUserResetPasswordDetails,
	login,
	resetUserPassword,
} from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
const ResetPasswordScreen = ({ match, history }) => {
	const emailToken = match.params.token
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [message, setMessage] = useState(null)

	const dispatch = useDispatch()
	const userLogin = useSelector((state) => state.userLogin)
	const { loading: loadingLogin, error: errorLogin, userInfo } = userLogin

	const userDetails = useSelector((state) => state.userDetails)
	const { loading, error, user } = userDetails

	const resetPassword = useSelector((state) => state.resetPassword)
	const {
		loading: loadingReset,
		error: errorReset,
		success: successReset,
	} = resetPassword

	useEffect(() => {
		if (successReset) {
			dispatch(login(email, password))
			alert(`Your Password is Updated.Logging in as ${name}.`)
			history.push('/')
		} else {
			if (!user || !user.name || successReset) {
				dispatch({ type: USER_UPDATE_PROFILE_RESET })
				dispatch(getUserResetPasswordDetails(emailToken))
			} else {
				setName(user.name)
				setEmail(user.email)
			}
		}
	}, [dispatch, history, user, successReset, emailToken])

	const submitHandler = (e) => {
		e.preventDefault()
		if (password !== confirmPassword) {
			setMessage('Passwords do not match')
		} else {
			dispatch(resetUserPassword(emailToken, password))
			// alert(`Your Password is Updated.Sign in...`)
			// history.push('/login')
		}
	}

	return (
		<>
			<FormContainer>
				<h1>Set New Password</h1>
				{loadingReset && <Loader />}
				{message && <Message variant='danger'>{message}</Message>}
				{successReset && (
					<Message variant='success'>{successReset.message}</Message>
				)}
				{errorReset && <Message variant='danger'>{errorReset}</Message>}
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
								placeholder={name}
								value={name}
								onChange={(e) => setName(e.target.value)}
								readOnly></Form.Control>
						</Form.Group>

						<Form.Group controlId='email'>
							<Form.Label>Email Address</Form.Label>
							<Form.Control
								type='email'
								placeholder={email}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								readOnly></Form.Control>
						</Form.Group>

						{/* <Form.Group controlId='isconfirmed'>
							<Form.Check
								type='checkbox'
								label='Do you confirm your Email Id?'
								checked={isConfirmed}
								onChange={(e) => setIsConfirmed(e.target.checked)}></Form.Check>
						</Form.Group> */}

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
							Confirm Password
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	)
}

export default ResetPasswordScreen
