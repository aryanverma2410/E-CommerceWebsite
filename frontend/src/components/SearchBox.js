import React, { useState } from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap'

const SearchBox = ({ history }) => {
	const [keyword, setKeyword] = useState('')

	const submitHandler = (e) => {
		e.preventDefault()
		if (keyword.trim()) {
			history.push(`/search/${keyword}`)
		} else {
			history.push('/')
		}
	}

	return (
		<Form onSubmit={submitHandler} inLine>
			<InputGroup>
				<Form.Control
					type='text'
					name='q'
					onChange={(e) => setKeyword(e.target.value)}
					placeholder='Search Products...'
					className='mr-sm-2ml-sm-5'></Form.Control>

				<InputGroup.Append>
					<InputGroup>
						<Button type='submit' variant='outline-success' className='p-auto'>
							<i class='fas fa-search'></i>
						</Button>
					</InputGroup>
				</InputGroup.Append>
			</InputGroup>
		</Form>
	)
}

export default SearchBox
