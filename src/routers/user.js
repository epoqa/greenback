const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
require('dotenv').config()
const {generateAuthToken, removeItemOnce} = require('../services/services')

let refreshTokens = []

router.get("authToken", auth, (req, res) => {
	res.status(201).send("გაატარე ჩვენიანია")
})
router.post('/users/register', async (req, res) => {
	req.body.username = req.body.username.toLowerCase()
	const user = new User(req.body)
	try {
		let existWithEmail = await User.findOne({email: req.body.email})
		if(existWithEmail) { 
			return res.status(400).send({error: 'ასეთი ემაილი უკვე არსებობს'})
		}
		let existWithUsername = await User.findOne({username: req.body.username.toLowerCase()})
		if(existWithUsername) {
			return res.status(400).send({error: 'ასეთი მომხმარებელი უკვე არსებობს'})
		}
		await user.save()
		res.status(201).send({ user})

	} catch (e) {
		res.status(400).send(e)
	}
    
})

router.delete('/users/logout', async (req, res) => {
	try {
		const refreshToken = req.body.refreshToken
		removeItemOnce(refreshTokens, refreshToken)
		res.send({message: 'წარმატებით გამოვიდა'})
	} catch (e) {
		res.status(400).send()
	}
})

router.post('/users/login', async (req, res) => {
	try {

		const user = await User.findOne({email: req.body.email})

		if(!user) {
			return res.status(400).send({error: 'ემაილი არასწორია'})
		}
		const isMatch = await bcrypt.compare(req.body.password, user.password)
		if(!isMatch) {
			return res.status(400).send({error: 'პაროლი არასწორია'})
		} 
		const refreshToken = jwt.sign({_id: user._id}, process.env.JWT_REFRESH_TOKEN , {expiresIn: '365d'})
		refreshTokens.push(refreshToken)
		const token = await generateAuthToken(user._id)
        
		res.send({ user, token, refreshToken })
	} catch (e) {
		res.status(400).send()
	}
})

router.put('/users/update', auth, async (req, res) => {
	req.body.username = req.body.username.toLowerCase()
	let existWithEmail = await User.findOne({email: req.body.email})
	if(existWithEmail) { 
		return res.status(400).send({error: 'ასეთი ემაილი უკვე არსებობს'})
	}
	let existWithUsername = await User.findOne({username: req.body.username.toLowerCase()})
	if(existWithUsername) {
		return res.status(400).send({error: 'მომხმარებელი უკვე არსებობს'})
	}
	if(req.body.password) { 
		req.body.password = await bcrypt.hash(req.body.password, 8)
	}
	try {
		const user = await User.findByIdAndUpdate(req.user._id, req.body, {new: true, runValidators: true})
		res.send(user)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.post('/renewAccessToken', (req, res) => {
	const refreshToken = req.body.refreshToken
	if(!refreshToken) {
		return res.status(400).send({ error: 'No refresh token' })
	}
	jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, async (err) => {
		if(err) {
			return res.status(401).send({ error: 'Refresh Token Is Expired' })
		}
		let HasRefreshToken = refreshTokens.includes(refreshToken)

		if(!HasRefreshToken) {
			return res.status(401).send({ error: 'Refresh Token Is Invalid'})
		}
		let decoded = jwt.decode(refreshToken)
		let token = await generateAuthToken(decoded._id)
		res.send({refreshToken, token})
	}   

	)})

router.get('/users/all', async(req,res) => {
	try {
		const userInfo = await User.find({})
		res.send(userInfo)
	} catch (e) {
		res.status(500).send()
	}

})

router.get('/users/me', auth, async(req,res) => {
	res.send(req.user)
})

router.get('/users/:username', async (req, res) => {
	const username = req.params.username.toLowerCase()

	try {
		const user = await User.findOne({username})
		if (!user) {
			return res.status(404).send('user doesn\'t exist')
		}
		res.send(user)
	} catch (e) {
		res.status(500).send()
	}

})






module.exports = router