import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import generateEmailToken from '../utils/generateEmailToken.js'
import generateToken from '../utils/generateToken.js'
import Product from '../models/productModel.js'
// @desc Auth user & get token
// @route POST /api/user/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ email })

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		})
	} else {
		res.status(401)
		throw new Error('Invalid Email or password')
	}
})

// @desc register new user
// @route POST /api/user/
// @access Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body
	const userExists = await User.findOne({ email })

	if (userExists) {
		res.status(400)
		throw new Error('User alredy exists')
	}
	const user = await User.create({
		name,
		email,
		password,
	})
	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
			emailToken: generateEmailToken(user._id),
		})
		user.sendConfirmationEmail(user)
	} else {
		res.status(400)
		throw new Error('Invalid user data')
	}
})

// @desc GET user profile
// @route GET /api/user/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)
	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			isConfirmed: user.isConfirmed,
			wishlists: user.wishlists,
		})
	} else {
		res.status(401)
		throw new Error('user not found')
	}
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)

	if (user) {
		user.name = req.body.name || user.name
		user.email = req.body.email || user.email
		if (req.body.password) {
			user.password = req.body.password
		}

		const updatedUser = await user.save()

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: generateToken(updatedUser._id),
		})
	} else {
		res.status(404)
		throw new Error('User not found')
	}
})

// @desc GET all users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({})
	res.json(users)
})

// @desc Delete User
// @route DELTE /api/users/:import {  } from 'module'
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id)

	if (user) {
		await user.remove()
		res.json({ message: 'User Removed' })
	} else {
		res.status(404)
		throw new Error('User not Found')
	}
})

// @desc GET user by ID
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select('-password')
	if (user) {
		res.json(user)
	} else {
		res.status(404)
		throw new Error('User not Found')
	}
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id)

	if (user) {
		user.name = req.body.name || user.name
		user.email = req.body.email || user.email
		user.isAdmin = req.body.isAdmin

		const updatedUser = await user.save()

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		})
	} else {
		res.status(404)
		throw new Error('User not found')
	}
})

const getUserByEmailToken = asyncHandler(async (req, res) => {
	const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET_EMAIL)

	const user = await User.findById(decoded.id).select('-password')
	if (user) {
		res.json(user)
	} else {
		res.status(404)
		throw new Error('User not found')
	}
})

// @desc    Update user confirm
// @route   PUT /api/users/confirm/:token
// @access  Private
const updateUserConfirm = asyncHandler(async (req, res) => {
	const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET_EMAIL)

	const user = await User.findById(decoded.id).select('-password')

	if (user) {
		user.name = req.body.name || user.name
		user.email = req.body.email || user.email
		user.isConfirmed = true

		const updatedUser = await user.save()

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			emailToken: updatedUser.emailToken,
			isConfirmed: updatedUser.isConfirmed,
		})
	} else {
		res.status(404)
		throw new Error('User not found')
	}
})

// @desc Resend User confirmation mail
// @route PUT /api/users/profile/resend
// @access Private
const resendUserConfirmationMail = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id)

	if (user) {
		user.sendConfirmationEmail(user)
		res.json({ message: 'Email Sent!' })
	} else {
		res.status(404)
		throw new Error('User not Found')
	}
})
// @desc Auth user & get token
// @route POST /api/user/reset
// @access Public
const resetUserPasswordMail = asyncHandler(async (req, res) => {
	const { email } = req.body
	const user = await User.findOne({ email })

	if (user) {
		res.status(201).json({
			emailToken: generateEmailToken(user._id),
		})
		user.sendResetPasswordEmail(user)
	} else {
		res.status(401)
		throw new Error('This Email is not registered')
	}
})

// @desc    Reset user password
// @route   PUT /api/users/reset/:token
// @access  Private
const updateUserPassword = asyncHandler(async (req, res) => {
	const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET_EMAIL)

	const user = await User.findById(decoded.id).select('-password')

	if (user) {
		user.name = req.body.name || user.name
		user.password = req.body.password || user.password

		const updatedUser = await user.save()

		res.json({ message: `Password Updated for ${user.name} <${user.email}>` })
	} else {
		res.status(404)
		throw new Error('User not found')
	}
})

// @desc    create new wish
// @route   POST /api/users/:id/wishlists
// @access  Private
const createProductWishlist = asyncHandler(async (req, res) => {
	const { productId } = req.body
	const user = await User.findById(req.params.id)
	const product = await Product.findById(productId)
	if (user) {
		const alreadyWishlisted = user.wishlists.find(
			(r) => r.productWish.toString() === productId.toString()
		)
		if (alreadyWishlisted) {
			const wishlist = {
				name: product.name,
				productWish: productId,
			}
			// user.wishlists.pop(wishlist)
			alreadyWishlisted.remove()

			await user.save()
			res.status(400)
			res.status(201).json({
				message: 'Product removed from Wishlist',
				_id: user._id,
				name: user.name,
				productName: product.name,
			})
		} else {
			const wishlist = {
				name: product.name,
				productWish: productId,
			}

			user.wishlists.push(wishlist)

			await user.save()
			res.status(201).json({
				message: 'Product added to Wishlist',
				_id: user._id,
				name: user.name,
				productName: product.name,
			})
		}
	} else {
		res.status(404)
		throw new Error('User not found')
	}
})

export {
	authUser,
	registerUser,
	getUserProfile,
	updateUserProfile,
	getUsers,
	deleteUser,
	getUserById,
	updateUser,
	getUserByEmailToken,
	updateUserConfirm,
	resendUserConfirmationMail,
	resetUserPasswordMail,
	updateUserPassword,
	createProductWishlist,
}
