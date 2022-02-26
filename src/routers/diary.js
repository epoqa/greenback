const express = require('express')

const router = new express.Router()
const Diary = require('../models/diary')
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/diary/create', auth, async (req, res) => {
	try {
		const diary = new Diary({
			owner: req.user.username.toLowerCase(),
			...req.body,
		})
		await diary.save()
		const diar = await Diary.findOne({
			id: req.body.id,
			owner: req.user.username.toLowerCase(),
		})

		await User.findOne({
			username: req.user.username.toLowerCase(),
		}).then((user) => {
			user.diariesNum = user.diariesNum + 1
			user.save()
		})

		res.send(diar)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.delete('/diary/delete/:id', auth, async (req, res) => {
	if (req.user.username.toLowerCase() !== req.body.owner.toLowerCase()) {
		return res.status(400).send({
			error: 'You are not the owner of this diary',
		})
	}
	try {
		await Diary.findOneAndDelete({
			id: req.params.id,
		}).then(() => {
			User.findOne({
				username: req.user.username.toLowerCase(),
			}).then((user) => {
				user.diariesNum = user.diariesNum - 1
				user.save()
			})
		})

		res.send('diary deleted')
	} catch (e) {
		res.status(400).send(e)
	}
})

router.get('/diary/id/:id', async (req, res) => {
	try {
		const diary = await Diary.findOne({
			id: req.params.id,
		})
		if (!diary) {
			return res.status(404).send()
		}
		res.send(diary)
	} catch (e) {
		res.status(500).send(e)
	}
})

router.get('/diary/user/:username', async (req, res) => {
	try {
		const diary = await Diary.find({
			owner: req.params.username.toLowerCase(),
		})
		if (!diary) {
			return res.status(404).send()
		}
		res.send(diary)
	} catch (e) {
		res.status(500).send(e)
	}
})

router.get('/diary/all', async (req, res) => {
	try {
		const diaries = await Diary.find({})
		res.send(diaries)
	} catch (e) {
		res.status(500).send(e)
	}
})

router.get('/diary/mine', auth, async (req, res) => {
	try {
		const diaries = await Diary.find({
			owner: req.user.username.toLowerCase(),
		})
		res.send(diaries)
	} catch (e) {
		res.status(500).send(e)
	}
})

router.put('/diary/update/:id', auth, async (req, res) => {
	if (req.user.username.toLowerCase() !== req.body.owner.toLowerCase()) {
		return res.status(401).send({
			error: 'You are not authorized to update this diary',
		})
	}

	const updates = Object.keys(req.body)
	const allowedUpdates = ['diaryName', 'type', 'description']
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	)

	if (!isValidOperation) {
		return res.status(400).send({
			error: 'Invalid updates!',
		})
	}

	try {
		const diary = await Diary.findOne({
			id: req.params.id,
		})

		if (!diary) {
			return res.status(404).send()
		}

		updates.forEach((update) => (diary[update] = req.body[update]))
		await diary.save()
		res.send(diary)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.put('/diary/picture/:id', auth, async (req, res) => {
	if (req.user.username.toLowerCase() !== req.body.owner.toLowerCase()) {
		return res.status(401).send({
			error: 'You are not authorized to update this diary',
		})
	}

	try {
		let diary = await Diary.findOne({
			id: req.params.id,
		})
		if (!diary) {
			return res.status(404).send()
		}
		diary.weeks.forEach((week) => {
			if (week.weekId === req.body.weekId) {
				week.pictures = [...week.pictures, { picture: req.body.picture }]
			}
		})

		res.status(200).send('photo added ')
		await diary.save()
	} catch (e) {
		res.status(400).send(e)
	}
})
router.put('/diary/week/:id', auth, async (req, res) => {
	try {
		const diary = await Diary.findOne({
			id: req.params.id,
		})
		if (!diary) {
			return res.status(404).send()
		}

		if (req.user.username.toLowerCase() !== diary.owner.toLowerCase()) {
			return res.status(401).send({
				error: 'You are not authorized to update this diary',
			})
		}
		diary.weeks.push({
			week: req.body.type,
			weekType: req.body.type,
			weekId: req.body.weekId,
		})
		await diary.save()
		res.send(diary)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.put('/diary/comment/:id', auth, async (req, res) => {
	try {
		const diary = await Diary.findOne({
			id: req.params.id,
		})
		if (!diary) {
			return res.status(404).send()
		}
		diary.comments.push({
			comment: req.body.comment,
			owner: req.user.username,
			commentId: req.body.commentId,
		})
		await diary.save()
		res.send(diary)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.delete('/diary/week/:id/:weekId', auth, async (req, res) => {
	try {
		const diary = await Diary.findOne({
			id: req.params.id,
		})
		if (req.user.username.toLowerCase() !== diary.owner.toLowerCase()) {
			return res.status(401).send({
				error: 'You are not authorized to update this diary',
			})
		}
		if (!diary) {
			return res.status(404).send()
		}
		diary.weeks = diary.weeks.filter(
			(week) => week.weekId !== req.params.weekId
		)

		await diary.save()
		res.send(diary)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.delete('/diary/id/:id', auth, async (req, res) => {
	try {
		const diary = await Diary.findOne({
			id: req.params.id,
		})
		if (req.user.username.toLowerCase() !== diary.owner.toLowerCase()) {
			return res.status(401).send({
				error: 'You are not authorized to update this diary',
			})
		}
		if (!diary) {
			return res.status(404).send()
		}
		await diary.remove()
		res.send(req.user.username)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.delete('/diary/:diaryid/comment/:commentid', auth, async (req, res) => {
	try {
		const diary = await Diary.findOne({
			id: req.params.diaryid,
		})
		if (!diary) {
			return res.status(404).send()
		}
		const comments = diary.comments
		const comment = comments.find((c) => c.commentId === req.params.commentid)

		if (req.user.username.toLowerCase() !== comment.owner.toLowerCase()) {
			return res.status(401).send({
				error: 'You are not authorized to update this diary',
			})
		}
		if (!comment) {
			return res.status(404).send()
		}
		const filtereedComments = diary.comments.filter(
			(comment) => comment.commentId !== req.params.commentid
		)
		diary.comments = filtereedComments
		await diary.save()
		res.status(200).send('comment deleted')
	} catch (e) {
		res.status(400).send(e)
	}
})

// like diary
router.put('/diary/like/:id', auth, async (req, res) => {
	try {
		const diary = await Diary.findOne({
			id: req.params.id,
		})
		if (!diary) {
			return res.status(404).send()
		}
		const user = req.user.username
		if (diary.likes.includes(user)) {
			return res.status(400).send({
				error: 'You have already liked this diary',
			})
		}
		diary.likes.push(user)
		await User.findOne({
			username: diary.owner,
		}).then((user) => {
			user.likes = user.likes + 1
			user.save()
		})

		await diary.save()
		res.send(diary)
	} catch (e) {
		res.status(400).send(e)
	}
})

// dislike diary
router.put('/diary/dislike/:id', auth, async (req, res) => {
	try {
		const diary = await Diary.findOne({
			id: req.params.id,
		})
		if (!diary) {
			return res.status(404).send()
		}
		const user = req.user.username
		if (!diary.likes.includes(user)) {
			return res.status(400).send({
				error: 'You have not liked this diary',
			})
		}
		diary.likes = diary.likes
			.filter((l) => l !== user)
			.then(() => {
				User.findOne({
					username: diary.owner,
				}).then((user) => {
					user.likes = user.likes - 1
					user.save()
				})
			})
		await diary.save()
		res.send(diary)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.post('/diary/authorcomment', auth, async (req, res) => {
	const authorComment = req.body.authorComment
	const diaryId = req.body.diaryId
	try {
		const diary = await Diary.findOne({
			id: diaryId,
		})
		if (!diary) {
			return res.status(404).send()
		}
		if(req.user.username !== diary.owner){
			return res.status(401).send({
				error: 'You are not authorized to update this diary',
			})
		}
		diary.authorComment = authorComment
		await diary.save()
		res.send(diary)

	} catch (e) {
		res.status(400).send(e)
	}
	



})

module.exports = router
