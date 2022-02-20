/* eslint-disable no-unused-vars */
const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const nodemailer = require('nodemailer')

require('dotenv').config()
const {
	generateAuthToken,
	removeItemOnce
} = require('../services/services')

let refreshTokens = []

router.get('/authToken', auth, (req, res) => {
	res.status(201).send(req.user)
})
router.post('/users/register', async (req, res) => {
	const code = req.body.code
	const token = req.body.token

	const decoded = jwt.verify(token, process.env.JWT_EMAIL_VERIFICATION)
	if (+decoded.code !== +code) {
		return res.status(400).send({
			error: 'არასწორი კოდი'
		})
	}
	if (decoded.email !== req.body.email) {
		return res.status(400).send({
			error: 'არასწორი ემაილი'
		})
	}

	req.body.username = req.body.username.toLowerCase()
	const user = new User(req.body)
	try {
		let existWithEmail = await User.findOne({
			email: req.body.email,
		})
		if (existWithEmail) {
			return res.status(400).send({
				error: 'ასეთი ემაილი უკვე არსებობს',
			})
		}
		let existWithUsername = await User.findOne({
			username: req.body.username.toLowerCase(),
		})
		if (existWithUsername) {
			return res.status(400).send({
				error: 'ასეთი მომხმარებელი უკვე არსებობს',
			})
		}
		await user.save()
		res.status(201).send({
			user,
		})
	} catch (e) {
		res.status(400).send(e)
	}
})

router.delete('/users/logout', async (req, res) => {
	try {
		const refreshToken = req.body.refreshToken
		removeItemOnce(refreshTokens, refreshToken)
		res.send({
			message: 'წარმატებით გამოვიდა',
		})
	} catch (e) {
		res.status(400).send()
	}
})

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findOne({
			email: req.body.email,
		})

		if (!user) {
			return res.status(400).send({
				error: 'ემაილი არასწორია',
			})
		}
		const isMatch = await bcrypt.compare(req.body.password, user.password)
		if (!isMatch) {
			return res.status(400).send({
				error: 'პაროლი არასწორია',
			})
		}
		const refreshToken = jwt.sign({
			_id: user._id,
		},
		process.env.JWT_REFRESH_TOKEN, {
			expiresIn: '365d',
		}
		)
		refreshTokens.push(refreshToken)
		const token = await generateAuthToken(user._id)

		res.send({
			user,
			token,
			refreshToken,
		})
	} catch (e) {
		res.status(400).send('პრობლემა')
	}
})

router.put('/users/update', auth, async (req, res) => {
	req.body.username = req.body.username.toLowerCase()
	let existWithEmail = await User.findOne({
		email: req.body.email,
	})
	if (existWithEmail) {
		return res.status(400).send({
			error: 'ასეთი ემაილი უკვე არსებობს',
		})
	}
	let existWithUsername = await User.findOne({
		username: req.body.username.toLowerCase(),
	})
	if (existWithUsername) {
		return res.status(400).send({
			error: 'მომხმარებელი უკვე არსებობს',
		})
	}
	if (req.body.password) {
		req.body.password = await bcrypt.hash(req.body.password, 8)
	}
	try {
		const user = await User.findByIdAndUpdate(req.user._id, req.body, {
			new: true,
			runValidators: true,
		})
		res.send(user)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.post('/renewAccessToken', (req, res) => {
	const refreshToken = req.body.refreshToken
	if (!refreshToken) {
		return res.status(400).send({
			error: 'No refresh token',
		})
	}
	jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, async (err) => {
		if (err) {
			return res.status(401).send({
				error: 'Refresh Token Is Expired',
			})
		}
		let HasRefreshToken = refreshTokens.includes(refreshToken)

		if (!HasRefreshToken) {
			return res.status(401).send({
				error: 'Refresh Token Is Invalid',
			})
		}
		let decoded = jwt.decode(refreshToken)
		let token = await generateAuthToken(decoded._id)
		res.send({
			refreshToken,
			token,
		})
	})
})

router.get('/users/all', async (req, res) => {
	try {
		const userInfo = await User.find({})
		res.send(userInfo)
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user)
})

router.get('/users/:username', async (req, res) => {
	const username = req.params.username.toLowerCase()

	try {
		const user = await User.findOne({
			username,
		})
		if (!user) {
			return res.status(404).send('user doesn\'t exist')
		}
		res.send(user)
	} catch (e) {
		res.status(500).send()
	}
})
const transporter = nodemailer.createTransport({
	service: 'Outlook365',
	auth: {
		user: 'ankoscoin@outlook.com',
		pass: 'xotrax007',
		port: '587',
	},
	tls: {
		ciphers: 'SSLv3',
		rejectUnauthorized: false,
	},
})

router.post('/user/verify', async (req, res) => {
	const {
		email
	} = req.body

	//this returns cors error

	// let existWithEmail = await User.findOne({
	// 	email: email,
	// })
	// if (existWithEmail) {
	// 	return res.status(400).send({
	// 		error: 'ასეთი ემაილი უკვე არსებობს',
	// 	})
	// }
	const code = Math.floor(Math.random() * (9999 - 1000) + 1000)

	const token = jwt.sign({
		email: email,
		code: code,
	},
	process.env.JWT_EMAIL_VERIFICATION, {
		expiresIn: '1h',
	}
	)

	try {
		const mailOptions = {
			from: 'ankoscoin@outlook.com',
			to: email,
			subject: 'ელ. ფოსტის ვერიფიკაცია',
			text: `შენი ვერიფიკაციის კოდია: ${code}`,
		}

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err)
			} else {
				console.log(info)
				res.status(200).send({
					token,
				})
			}
		})
	} catch (e) {
		res.status(500).send()
	}
})

// password recover
router.post('/user/recover', async (req, res) => {
	const { email } = req.body

	const user = await User.findOne({
		email,
	})
	if (!user) {
		return res.status(404).send({
			error: 'ასეთი მომხმარებელი არ არსებობს',
		})
	}

	const token = jwt.sign({
		_id: user._id,
	},
	process.env.JWT_EMAIL_VERIFICATION, {
		expiresIn: '1h',
	}
	)

	try {
		const mailOptions = {
			from: 'ankoscoin@outlook.com',
			to: email,
			subject: 'პაროლის აღდგენა',
			text: `აღდგენის ლინკია: www.domain.com/recover/${token}`,
		}

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err)
			} else {
				console.log(info)
				res.status(200).send({
					message: 'აღდგენის ლინკი წარმატებით გაიგზავნა თქვენს ემაილზე'
					
				})
			}
		})
	}
	catch (e) {
		res.status(500).send()
	}	
})


router.post('/user/recover/:token', async (req, res) => {
	const { password } = req.body
	const { token } = req.params

	try {
		const decoded = jwt.verify(token, process.env.JWT_EMAIL_VERIFICATION)
		const user = await User.findOne({
			_id: decoded._id,
		})
		if (!user) {
			return res.status(404).send({
				error: 'ასეთი მომხმარებელი არ არსებობს',
			})
		}
		user.password = password
		await user.save()
			.then(() => {
				res.status(200).send({
					message: 'პაროლი წარმატებით შეიცვალა'
				})
			}
			)

	}
	catch (e) {
		res.status(500).send()
	}


})

module.exports = router