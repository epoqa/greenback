const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	picture: {
		type: String,
		trim: true,
		default: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
	},
	gender:{
		type: String,
		trim: true,
		default: 'none'
	},
	age:{
		type: Number,
		default: 0
	},
	location:{
		type: String,
		trim: true,
		default: 'none'
	},
	about:{
		type: String,
		trim: true,
		default: 'none'
	},
	likes: {
		type: Number,
		default: 0
	},
	diariesNum: {
		type: Number,
		default: 0
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Email is invalid')
			}
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		trim: true,
		validate(value) {
			if (value.toLowerCase().includes('password')) {
				throw new Error('Password cannot contain "password"')
			}
		}
	},
	Joined: {
		type: Date, 
		default: Date.now
	}

})



userSchema.pre('save', async function (next) {
	const user = this
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}
	next()

})

const User = mongoose.model('User', userSchema)

module.exports = User
