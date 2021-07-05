import React from 'react'
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap'

const Footer = () => {
	return (
		<footer>
			<Container>
				<Row className='px-5'>
					<Col className='text-centre py-3' md='4'>
						<Row>CONTACT US</Row>

						<Row className='py-3'>
							<Col className='my-auto px-auto' md='1'>
								<i className='fa fa-map-marker'></i>
							</Col>
							<Col>
								Plot No. 13, Sec - 57, Phase IV, HSIIDC, Kundli Industrial
								Estate, Sonepat, Haryana - 131028. India
							</Col>
						</Row>
						<Row className='py-3'>
							<Col className='my-auto px-auto' md='1'>
								<i className='fa fa-phone'></i>
							</Col>
							<Col>+91 130 2370527, 2370528</Col>
						</Row>
						<Row className='py-3'>
							<Col className='my-auto px-auto' md='1'>
								<i className='fa fa-envelope'></i>
							</Col>
							<Col>
								enquiry@vinovekitchenwares.com, info@vinovekitchenwares.com
							</Col>
						</Row>
					</Col>
					<Col className='text-centre py-3' md='4'>
						LOCATE US
					</Col>
					<Col className='text-centre py-3' md='4'>
						<Form>
							<Col>
								<Row>
									<InputGroup className='mb-3'>
										<Form.Control
											type='email'
											name='q'
											// onChange={(e) => setKeyword(e.target.value)}
											placeholder='Enter your email address'
											className='mr-sm-2ml-sm-5'></Form.Control>
										<InputGroup.Append>
											<InputGroup>
												<Button type='' variant='info' className='py-auto'>
													<i className='fa fa-paper-plane'></i>
												</Button>
											</InputGroup>
										</InputGroup.Append>
									</InputGroup>
								</Row>
								<Col className='my-5'>
									<button
										type='button'
										class='btn btn-outline-primary p-auto m-3'
										data-bs-toggle='tooltip'
										data-bs-placement='left'
										title='Facebook'>
										<i class='fab fa-facebook-f fa-2x'></i>
									</button>

									<button
										type='button'
										class='btn btn-outline-primary p-auto m-3'
										data-bs-toggle='tooltip'
										data-bs-placement='top'
										title='Twitter'>
										<i class='fab fa-twitter fa-2x'></i>
									</button>

									<button
										type='button'
										class='btn btn-outline-primary p-auto m-3'
										data-bs-toggle='tooltip'
										data-bs-placement='bottom'
										title='Instagram'>
										<i class='fab fa-instagram fa-2x'></i>
									</button>
								</Col>
							</Col>
						</Form>
					</Col>
				</Row>
			</Container>
		</footer>
	)
}

export default Footer
