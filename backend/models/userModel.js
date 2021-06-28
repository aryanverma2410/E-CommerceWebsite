import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import generateEmailToken from '../utils/generateEmailToken.js'
import { google } from 'googleapis'
const OAuth2 = google.auth.OAuth2
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

	// const accessToken = await new Promise((resolve, reject) => {
	// 	oauth2Client.getAccessToken((err, token) => {
	// 		if (err) {
	// 			console.log(TOKEN_PATH)
	// 			reject('Failed to create access token :(')
	// 		}
	// 		resolve(token)
	// 	})
	// })
	// 	.then(() => {
	// 		console.log(`Access Token Recieved`)
	// 	})
	// 	.catch((error) => {
	// 		console.log(`Access Token Recieved`)
	// 		console.error(error)
	// 	})

	const transporter = nodemailer.createTransport({
		//creating transport for sending mails
		// host: 'smtp.gmail.com',
		// port: 465,
		// secure: true,
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.GMAIL_USER,
			clientId: process.env.GMAIL_CLIENT_ID,
			clientSecret: process.env.GMAIL_CLIENT_SECRET,
			refreshToken: process.env.GMAIL_REFRESH_TOKEN,
		},
	})
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
	emailTransporter
		.sendMail({
			from: process.env.GMAIL_USER,
			to: `${enteredUser.email}`,
			subject: 'ConfirmationEmail',
			html: `Dear ${enteredUser.name} please confirm your Email <a href=${url}>Click Here</a>	 <br> If Above link dosen't work, <a href=${url2}>click Here</a>`,
			//
			auth: {
				user: process.env.GMAIL_USER,
				refreshToken: process.env.GMAIL_REFRESH_TOKEN,
				accessToken:
					'ya29.a0ARrdaM_MO6qlEpOzzOZ8SiZmfyFs0d4BFbhpcfCuPYWN9im6i5miUBzquIqxE8OKagjfmkcp3TiIJrKU5M8o_2e_7bBdibyRqyABBHwqi7xl5l27D7cc6h7G6ggbsgUBs2rFdxQ7HurAJJpu7JqBeI1F1Vn9',
			},
		})
		.then(() => {
			console.log(
				`Email sent! to user ${enteredUser.name} at ${enteredUser.email}`
			)
		})
		.catch((error) => {
			console.log(`${enteredUser.name} Email was not sent`)
			console.error(error)
		})
}

const User = mongoose.model('User', userSchema)

export default User
