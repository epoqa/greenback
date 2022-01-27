const mongoose = require('mongoose')

const Diary = mongoose.model('Diary', {
	diaryName: {
		type: String,
		required: true,
		trim: true
	},
	id:{
		type: String,
		required:true,
		trim: true
	},
	type: {
		type: String,
		required: true,
		trim: true
	},
	light: {
		type: String,
		required: true,
		trim: true
	},
	owner: {
		type: String,
		required: true,
		ref: 'User'
	},
	fertilizer: {
		type: String,
		required: true,
		trim: true
	},
	technology: {
		type: String,
		required: true,
		trim: true
	},
	room:{
		type: String,
		required: true,
		trim: true
	},
	ground: {
		type: String,
		required: true,
		trim: true
	},
	createdAt: {
		type: Date, 
		default: Date.now
	},
	pictures: [
		{
			createdAt: {
				type: Date, 
				default: Date.now
			},
			picture: String
		}
	],
	comments:  [
		{
			owner: String,
			comment: String,         
			createdAt: {
				type: Date,
				default: Date.now
			}
            
		}
	]
})   
module.exports = Diary