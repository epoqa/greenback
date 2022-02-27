const mongoose = require('mongoose')

const Diary = mongoose.model('Diary', {
	diaryName: {
		type: String,
		required: true,
		trim: true,
	},
	authorComment:{
		type: String,
		trim: true,		
	},
	likes: [
		{
			type: String,
			trim: true,
		},
	],
	id: {
		type: String,
		required: true,
		trim: true,
	},
	facturer: {
		type: String,
		required: true,
		trim: true,
	},
	type: {
		type: String,
		required: true,
		trim: true,
	},
	light: {
		type: String,
		required: true,
		trim: true,
	},
	owner: {
		type: String,
		required: true,
		ref: 'User',
	},
	fertilizer: {
		type: String,
		required: true,
		trim: true,
	},
	technology: {
		type: String,
		required: true,
		trim: true,
	},
	room: {
		type: String,
		required: true,
		trim: true,
	},
	ground: {
		type: String,
		required: true,
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	weeks: [
		{
			week: {
				type: String,
				required: true,
				trim: true,
			},
			weekType: {
				type: String,
				required: true,
				trim: true,
			},
			weekId: {
				type: String,
				required: true,
				trim: true,
			},
			createdAt: {
				type: Date,
				default: Date.now,
			},
			pictures: [
				{
					picture: {
						type: String,
						trim: true,
					},
					createdAt: {
						type: Date,
						default: Date.now,
					},
				},
			],
		},
	],
	comments: [
		{
			owner: String,
			comment: String,
			commentId: String,
			picture: String,
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
})
module.exports = Diary
