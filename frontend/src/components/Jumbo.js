import React from 'react'
import { Row, Jumbotron, Button } from 'react-bootstrap'

const Jumbo = () => {
	return (
		<Jumbotron className='my-0'>
			<Row>
				<h6 color='white'>INTRODUCTION ○ VINOVE ○ 2021</h6>
				<h1 color='white'>One Stop Destination To Decorate Your Kitchen</h1>
				<p>
					This is a simple hero unit, a simple jumbotron-style component for
					calling extra attention to featured content or information.
				</p>
			</Row>

			<p>
				<Button variant='primary'>Get App</Button>
			</p>
		</Jumbotron>
	)
}

export default Jumbo
