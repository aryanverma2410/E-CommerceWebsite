import express from 'express'
const router = express.Router()
import {
	createPackaging,
	deletePackaging,
	getPackagingById,
	getPackagings,
	updatePackaging,
} from '../controllers/packagingController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
router.route('/').get(getPackagings).post(protect, admin, createPackaging)
router
	.route('/:id')
	.get(getPackagingById)
	.delete(protect, admin, deletePackaging)
	.put(protect, admin, updatePackaging)

export default router
