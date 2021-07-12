import { Card, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'
const Product = ({ product }) => {
	return (
		<Card className='my-3 px-1 py-1 rounded'>
			<Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
				<Card.Header>
					<strong>{product.name}</strong>
				</Card.Header>

				<div className='img-wrapper'>
					<img src={product.image} variant='top' className='hover-zoom' />
				</div>
			</Link>

			<Card.Body>
				<Card.Text as='div'>
					<Rating
						value={product.rating}
						text={`${product.numReviews} reviews.`}
					/>
				</Card.Text>

				<Card.Text as='h3'>${product.price}</Card.Text>
			</Card.Body>
		</Card>
	)
}

export default Product
