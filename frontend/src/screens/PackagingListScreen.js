import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import {
	listPackagings,
	deletePackaging,
	createPackaging,
} from '../actions/packagingActions'
import { PACKAGING_CREATE_RESET } from '../constants/packagingConstants'

const PackagingListScreen = ({ history, match }) => {
	const pageNumber = match.params.pageNumber || 1
	const dispatch = useDispatch()

	const packagingList = useSelector((state) => state.packagingList)
	const { loading, error, packagings, page, pages } = packagingList

	const packagingDelete = useSelector((state) => state.packagingDelete)
	const {
		loading: loadingDelete,
		error: errorDelete,
		success: successDelete,
	} = packagingDelete

	const packagingCreate = useSelector((state) => state.packagingCreate)
	const {
		loading: loadingCreate,
		error: errorCreate,
		success: successCreate,
		packaging: createdPackaging,
	} = packagingCreate

	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

	useEffect(() => {
		dispatch({ type: PACKAGING_CREATE_RESET })
		if (!userInfo || !userInfo.isAdmin) {
			history.push('/login')
		}
		if (successCreate) {
			history.push(`/admin/packaging/${createdPackaging._id}/edit`)
		} else {
			dispatch(listPackagings('', pageNumber))
		}
	}, [
		dispatch,
		history,
		userInfo,
		successDelete,
		successCreate,
		createdPackaging,
		pageNumber,
	])

	const deleteHandler = (id) => {
		if (window.confirm('Are you sure?')) {
			dispatch(deletePackaging(id))
		}
	}
	const createPackagingHandler = () => {
		dispatch(createPackaging())
	}
	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Packagings</h1>
				</Col>
				<Col className='text-right'>
					<Button clasName='my-3' onClick={createPackagingHandler}>
						<i className='fas fa-plus'></i>Create Packaging
					</Button>
				</Col>
			</Row>
			{loadingDelete && <Loader />}
			{errorDelete && <Message variant='danger'>{errorDelete}</Message>}

			{loadingCreate && <Loader />}
			{errorCreate && <Message variant='danger'>{errorCreate}</Message>}

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<>
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PRICE</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{packagings.map((packaging) => (
								<tr key={packaging._id}>
									<td>{packaging._id}</td>
									<td>{packaging.name}</td>
									<td>${packaging.price}</td>
									<td>
										<LinkContainer
											to={`/admin/packaging/${packaging._id}/edit`}>
											<Button variant='light' className='btn-sm'>
												<i className='fas fa-edit'></i>
											</Button>
										</LinkContainer>
										<Button
											variant='danger'
											className='btn-sm'
											onClick={() => deleteHandler(packaging._id)}>
											<i className='fas fa-trash'></i>
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>

					<Paginate pages={pages} page={page} isAdmin={true} />
				</>
			)}
		</>
	)
}

export default PackagingListScreen
