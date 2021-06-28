import jwt from 'jsonwebtoken'

export const generateEmailToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET_EMAIL, {
		expiresIn: '3d',
	})
}

export default generateEmailToken
