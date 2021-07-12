import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import generateEmailToken from '../utils/generateEmailToken.js'
import { google } from 'googleapis'

const OAuth2 = google.auth.OAuth2

const wishlistSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		productWish: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
)
const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
		isConfirmed: {
			type: Boolean,
			required: true,
			default: false,
		},
		wishlists: [wishlistSchema],
	},
	{
		timestamps: true,
	}
)

userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

/******************CREATING GOOGLE API TO GENERATE ACCESSTOKEN  *********************/

const createTransporter = async () => {
	const oauth2Client = new OAuth2(
		process.env.GMAIL_CLIENT_ID,
		process.env.GMAIL_CLIENT_SECRET,
		'https://developers.google.com/oauthplayground'
	)

	oauth2Client.setCredentials({
		refresh_token: process.env.GMAIL_REFRESH_TOKEN,
	})

	const accessToken = await new Promise((resolve, reject) => {
		oauth2Client.getAccessToken((err, token) => {
			if (err) {
				reject('Failed to create access token :(')
				console.log(err)
			}
			resolve(token)
		})
	})
		.then(() => {
			console.log(`accessToken recieved`)
		})
		.catch((error) => {
			console.log(`Access token not recieved`)
			console.error(error)
		})

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.GMAIL_USER,
			accessToken,
			clientId: process.env.GMAIL_CLIENT_ID,
			clientSecret: process.env.GMAIL_CLIENT_SECRET,
			refreshToken: process.env.GMAIL_REFRESH_TOKEN,
		},
		tls: {
			rejectUnauthorized: false,
		},
	})
	// transporter.set('oauth2_provision_cb', (GMAIL_CLIENT_ID, renew, callback) => {
	// 	let accessToken = userTokens[GMAIL_CLIENT_ID]
	// 	if (!accessToken) {
	// 		return callback(new Error('Unknown user'))
	// 	} else {
	// 		return callback(null, accessToken)
	// 	}
	// })
	return transporter
}

userSchema.methods.sendConfirmationEmail = async function (enteredUser) {
	//send mail fucntion
	const emailToken = generateEmailToken(enteredUser._id)

	// if (process.env.NODE_ENV === 'developement') {
	// 	const url = `http://localhost:3000/api/user/confirmation/${emailToken}`
	// } else {
	// 	const url = `https://avproshop.herokuapp.com/api/user/confirmation/${emailToken}`
	// }
	const url = `http://localhost:3000/api/user/confirmation/${emailToken}`
	const url2 = `https://avproshop.herokuapp.com/api/user/confirmation/${emailToken}`
	let emailTransporter = await createTransporter()
	await emailTransporter
		.sendMail({
			from: process.env.GMAIL_USER,
			to: `${enteredUser.email}`,
			subject: 'ConfirmationEmail',
			html: `Dear ${enteredUser.name} please confirm your Email <a href=${url2}>Click Here</a>  <br> If Above link dosen't work, <a href=${url}>click Here</a>`,
			//
			auth: {
				user: process.env.GMAIL_USER,
				refreshToken: process.env.GMAIL_REFRESH_TOKEN,
				// 	accessToken:
				// 		'ya29.a0ARrdaM9PMQClc-5BPH4TvAUzmLRIe2ip93SjHJM_f0sOxrzPz3wCFEjGfO1DekLkW2nQdQWVk9xk669I_Z-4bYhNMlLeYd9RWAHv3ad2_ALjYMXWKV-QZFvPhNhrvezuIL-ZgM-ZvVxy4hIEW1-rWmjcL3vq',
			},
		})
		.then(() => {
			console.log(
				`Email sent! to user ${enteredUser.name} at ${enteredUser.email}`
			)
		})
		.catch((error) => {
			console.log(
				`${enteredUser.name} <${enteredUser.email}> Email was not sent`
			)
			console.error(error)
		})
}

userSchema.methods.sendResetPasswordEmail = async function (enteredUser) {
	//send mail fucntion
	const emailToken = generateEmailToken(enteredUser._id)

	// if (process.env.NODE_ENV === 'developement') {
	// 	const url = `http://localhost:3000/api/user/confirmation/${emailToken}`
	// } else {
	// 	const url = `https://avproshop.herokuapp.com/api/user/confirmation/${emailToken}`
	// }
	const url = `http://localhost:3000/api/user/reset/${emailToken}`
	const url2 = `https://avproshop.herokuapp.com/api/user/reset/${emailToken}`
	let emailTransporter = await createTransporter()
	await emailTransporter
		.sendMail({
			from: process.env.GMAIL_USER,
			to: `${enteredUser.email}`,
			subject: 'Password Reset Request',
			html: `Dear ${enteredUser.name} you requested to reset your password <a href=${url2}>Click Here</a> to reset your password. <br> If Above link dosen't work, <a href=${url}>click Here</a> <br>If you didnt request a password reset,contact our support`,
			//
			auth: {
				user: process.env.GMAIL_USER,
				refreshToken: process.env.GMAIL_REFRESH_TOKEN,
				// 	accessToken:
				// 		'ya29.a0ARrdaM9PMQClc-5BPH4TvAUzmLRIe2ip93SjHJM_f0sOxrzPz3wCFEjGfO1DekLkW2nQdQWVk9xk669I_Z-4bYhNMlLeYd9RWAHv3ad2_ALjYMXWKV-QZFvPhNhrvezuIL-ZgM-ZvVxy4hIEW1-rWmjcL3vq',
			},
		})
		.then(() => {
			console.log(
				` Reset password email sent! to user ${enteredUser.name} at ${enteredUser.email}`
			)
		})
		.catch((error) => {
			console.log(
				`${enteredUser.name} <${enteredUser.email}> Reset password email was not sent`
			)
			console.error(error)
		})
}

const User = mongoose.model('User', userSchema)

export default User
