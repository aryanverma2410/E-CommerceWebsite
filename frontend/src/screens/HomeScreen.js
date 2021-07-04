import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Product from '../components/Product'
import Message from '../components/Message.js'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { Row, Col, Button } from 'react-bootstrap'
import { listProducts } from '../actions/productActions'
import ProductCarousel from '../components/ProductCarousel'

const HomeScreen = ({ match }) => {
	const keyword = match.params.keyword

	const pageNumber = match.params.pageNumber || 1

	const [sortBy, setSortBy] = useState(1)

	const dispatch = useDispatch()

	const productList = useSelector((state) => state.productList)
	const { loading, error, products, page, pages } = productList

	// const buttonHandler = () => {
	// 	setSortBy1(!sortBy1)
	// }

	useEffect(() => {
		dispatch(listProducts(keyword, pageNumber))
	}, [dispatch, keyword, pageNumber, sortBy])

	return (
		<>
			{/* <Button onClick={buttonHandler}>{sortBy1}</Button> */}

			{!keyword ? (
				// <ProductCarousel />
				<Row></Row>
			) : (
				<Link to='/' className='btn  btn-primary my-3 rounded-3'>
					Go Back
				</Link>
			)}
			<Row>
				<Col md={8}>
					<h1>Latest Products</h1>
				</Col>
				<Col md={4}>
					<select
						class='form-select  bg-color: transparent font-size:2px'
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}>
						<option key={1} value={1}>
							Sort by: Newest Arrivals
						</option>
						<option key={2} value={2}>
							Price:Low to High
						</option>
						<option key={3} value={3}>
							Price: High to Low
						</option>
						<option key={4} value={4}>
							Avg. Customer Review
						</option>
					</select>
				</Col>
			</Row>

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<>
					{Number(sortBy) === 1 ? (
						<Row>
							{console.log('SortBy:Latest Products')}
							{products.reverse().map((product) => (
								<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
									<Product product={product} />
								</Col>
							))}
						</Row>
					) : (
						<>
							{Number(sortBy) === 2 ? (
								<Row>
									{console.log('Low to High')}
									{products
										.sort((a, b) => a.price - b.price)
										.map((product) => (
											<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
												<Product product={product} />
											</Col>
										))}
								</Row>
							) : (
								<>
									{Number(sortBy) === 3 ? (
										<Row>
											{console.log('High to Low')}
											{products
												.sort((b, a) => a.price - b.price)
												.map((product) => (
													<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
														<Product product={product} />
													</Col>
												))}
										</Row>
									) : (
										<Row>
											{console.log('Avg. customer Review')}
											{products
												.sort((b, a) => a.rating - b.rating)
												.map((product) => (
													<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
														<Product product={product} />
													</Col>
												))}
										</Row>
									)}
								</>
							)}
						</>
					)}
					<Paginate
						pages={pages}
						page={page}
						keyword={keyword ? keyword : ''}></Paginate>
				</>
			)}
		</>
	)
}

export default HomeScreen
