import express from 'express'
const router = express.Router()
import {
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
	createProductWishlist,
	resetUserPasswordMail,
	updateUserPassword,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/login', authUser)
router.post('/reset', resetUserPasswordMail)
router.put('/:id/resend', protect, resendUserConfirmationMail)
router
	.route('/confirmation/:token')
	.get(getUserByEmailToken)
	.put(updateUserConfirm)
router.route('/reset/:token').get(getUserByEmailToken).put(updateUserPassword)
router
	.route('/profile')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile)
router
	.route('/:id')
	.delete(protect, admin, deleteUser)
	.get(protect, admin, getUserById)
	.put(protect, admin, updateUser)
router.route('/:id/wishlists').post(protect, createProductWishlist)
export default router
