import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Product from '../components/Product'
import Message from '../components/Message.js'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Jumbo from '../components/Jumbo'
import { Row, Col, Card } from 'react-bootstrap'
import { listProducts } from '../actions/productActions'
import ProductCarousel from '../components/ProductCarousel'

const HomeScreen = ({ match }) => {
	const keyword = match.params.keyword

	const pageNumber = match.params.pageNumber || 1

	const [sortBy, setSortBy] = useState(1)

	const dispatch = useDispatch()

	const productList = useSelector((state) => state.productList)
	const { loading, error, products, page, pages } = productList

	useEffect(() => {
		dispatch(listProducts(keyword, pageNumber))
	}, [dispatch, keyword, pageNumber])

	return (
		<>
			{!keyword ? (
				<>
					<Jumbo />
					<ProductCarousel />
					<Row className='my-5 mx-5'>
						<Col md={8}>
							<h1>Latest Products</h1>
						</Col>
						<Col md={4} className=' py-2'>
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
								<option key={5} value={5}>
									Name: A to Z
								</option>
								<option key={6} value={6}>
									Name: Z to A
								</option>
							</select>
						</Col>
					</Row>
				</>
			) : (
				<Row className='mx-5'>
					<Col md={3}>
						<Link to='/' className='btn  btn-primary my-3 rounded-3'>
							Go Back
						</Link>
					</Col>
					<Col md={6} className='py-auto my-auto px-1'>
						<h2>Search results for {keyword}</h2>
					</Col>
					<Col md={3} className='py-auto my-auto'>
						<Row>Total {products.length} products found.</Row>
						<Row className=' py-2'>
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
								<option key={5} value={5}>
									Name: A to Z
								</option>
								<option key={6} value={6}>
									Name: Z to A
								</option>
							</select>
						</Row>
					</Col>
				</Row>
			)}

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger' className='mx-5'>
					{error}
				</Message>
			) : (
				<>
					{Number(sortBy) === 1 ? (
						<Row className='mx-5'>
							{/* {console.log('SortBy:Latest Products')} */}
							{products.reverse().map((product) => (
								<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
									<Product product={product} />
								</Col>
							))}
						</Row>
					) : (
						<>
							{Number(sortBy) === 2 ? (
								<Row className='mx-5'>
									{/* {console.log('Low to High')} */}
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
										<Row className='mx-5'>
											{/* {console.log('High to Low')} */}
											{products
												.sort((b, a) => a.price - b.price)
												.map((product) => (
													<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
														<Product product={product} />
													</Col>
												))}
										</Row>
									) : (
										<>
											{Number(sortBy) === 4 ? (
												<Row className='mx-5'>
													{/* {console.log('Avg. customer Review')} */}
													{products
														.sort((b, a) => a.rating - b.rating)
														.map((product) => (
															<Col
																key={product._id}
																sm={12}
																md={6}
																lg={4}
																xl={3}>
																<Product product={product} />
															</Col>
														))}
												</Row>
											) : (
												<>
													{Number(sortBy) === 5 ? (
														<Row className='mx-5'>
															{/* {console.log('Name: A to Z')} */}
															{products
																.sort((a, b) =>
																	a.name.toUpperCase() < b.name.toUpperCase()
																		? -1
																		: a.name.toUpperCase() >
																		  b.name.toUpperCase()
																		? 1
																		: 0
																)
																.map((product) => (
																	<Col
																		key={product._id}
																		sm={12}
																		md={6}
																		lg={4}
																		xl={3}>
																		<Product product={product} />
																	</Col>
																))}
														</Row>
													) : (
														<Row className='mx-5'>
															{/* {console.log('Name:Z to A')} */}
															{products
																.sort((b, a) =>
																	a.name.toUpperCase() < b.name.toUpperCase()
																		? -1
																		: a.name.toUpperCase() >
																		  b.name.toUpperCase()
																		? 1
																		: 0
																)
																.map((product) => (
																	<Col
																		key={product._id}
																		sm={12}
																		md={6}
																		lg={4}
																		xl={3}>
																		<Product product={product} />
																	</Col>
																))}
														</Row>
													)}
												</>
											)}
										</>
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
