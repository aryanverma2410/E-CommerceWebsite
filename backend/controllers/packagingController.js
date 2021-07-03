import asyncHandler from 'express-async-handler'
import Packaging from '../models/packagingModel.js'

// @desc Fetch all Packaging
// @route GET /api/packaging
// @access Public
const getPackagings = asyncHandler(async (req, res) => {
	const pageSize = 10

	const page = Number(req.query.pageNumber) || 1

	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'i',
				},
		  }
		: {}

	const count = await Packaging.countDocuments({ ...keyword })
	const packagings = await Packaging.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1))

	res.json({ packagings, page, pages: Math.ceil(count / pageSize) })
})

// @desc Fetch single packaging
// @route GET /api/packaging/:id
// @access Public

const getPackagingById = asyncHandler(async (req, res) => {
	const packaging = await Packaging.findById(req.params.id)

	if (packaging) {
		res.json(packaging)
	} else {
		res.status(404)
		throw new Error('Packaging not found')
	}
})
// @desc    Delete a packaging
// @route   DELETE /api/packagings/:id
// @access  Private/Admin
const deletePackaging = asyncHandler(async (req, res) => {
	const packaging = await Packaging.findById(req.params.id)

	if (packaging) {
		await packaging.remove()
		res.json({ message: 'packaging removed' })
	} else {
		res.status(404)
		throw new Error('packaging not found')
	}
})

// @desc    Create a Packaging
// @route   POST /api/Packagings/
// @access  Private/Admin
const createPackaging = asyncHandler(async (req, res) => {
	const packaging = new Packaging({
		name: 'Sample Name',
		price: 0,
		user: req.user._id,
		image: '/image/sample.jpg',
	})

	const createdPackaging = await packaging.save()
	res.status(201).json(createdPackaging)
})

// @desc    update a packaging
// @route   PUT /api/packagings/:id
// @access  Private/Admin
const updatePackaging = asyncHandler(async (req, res) => {
	const { name, price, image } = req.body

	const packaging = await Packaging.findById(req.params.id)

	if (packaging) {
		packaging.name = name
		packaging.price = price
		packaging.image = image

		const updatedPackaging = await packaging.save()
		res.json(updatedPackaging)
	} else {
		res.status(404)
		throw new Error('packaging not found')
	}
})

export {
	getPackagings,
	getPackagingById,
	deletePackaging,
	createPackaging,
	updatePackaging,
}
