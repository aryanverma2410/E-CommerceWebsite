import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import {
	listPackagingDetails,
	updatePackaging,
} from '../actions/packagingActions'
import { PACKAGING_UPDATE_RESET } from '../constants/packagingConstants'

const PackagingEditScreen = ({ match, history }) => {
	const packagingId = match.params.id

	const [name, setName] = useState('')
	const [price, setPrice] = useState(0)
	const [image, setImage] = useState('')
	const [uploading, setUploading] = useState(false)

	const dispatch = useDispatch()

	const packagingDetails = useSelector((state) => state.packagingDetails)
	const { loading, error, packaging } = packagingDetails

	const packagingUpdate = useSelector((state) => state.packagingUpdate)
	const {
		loading: loadingUpdate,
		error: errorUpdate,
		success: successUpdate,
	} = packagingUpdate

	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: PACKAGING_UPDATE_RESET })
			history.push('/admin/packaginglist')
		} else {
			if (!packaging.name || packaging._id !== packagingId) {
				dispatch(listPackagingDetails(packagingId))
			} else {
				setName(packaging.name)
				setPrice(packaging.price)
				setImage(packaging.image)
			}
		}
	}, [dispatch, history, packagingId, packaging, successUpdate])

	const uploadFileHandler = async (e) => {
		const file = e.target.files[0]
		const formData = new FormData()
		formData.append('image', file)
		setUploading(true)

		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}

			const { data } = await axios.post('/api/upload', formData, config)

			setImage(data)
			setUploading(false)
		} catch (error) {
			console.error(error)
			setUploading(false)
		}
	}

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(
			updatePackaging({
				_id: packagingId,
				name,
				price,
				image,
			})
		)
	}

	return (
		<>
			<Link to='/admin/packaginglist' className='btn btn-light my-3'>
				Go Back
			</Link>
			<FormContainer>
				<h1>Edit Packaging</h1>
				{loadingUpdate && <Loader />}
				{errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
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

						<Form.Group controlId='price'>
							<Form.Label>Price</Form.Label>
							<Form.Control
								type='number'
								placeholder='Enter price'
								value={price}
								onChange={(e) => setPrice(e.target.value)}></Form.Control>
						</Form.Group>

						<Form.Group controlId='image'>
							<Form.Label>Image</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter image url'
								value={image}
								onChange={(e) => setImage(e.target.value)}></Form.Control>
							<Form.File
								id='image-file'
								label='Choose File'
								custom
								onChange={uploadFileHandler}></Form.File>
							{uploading && <Loader />}
						</Form.Group>

						<Button type='submit' variant='primary'>
							Update
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	)
}

export default PackagingEditScreen
