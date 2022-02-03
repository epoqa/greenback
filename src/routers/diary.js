const express = require('express')

const router = new express.Router()
const Diary = require('../models/diary')
const auth = require('../middleware/auth')

router.post('/diary/create', auth, async (req, res) => {
	try {
		const diary = new Diary({owner: req.user.username.toLowerCase(), ...req.body})
		await diary.save()
		const diar = await Diary.findOne({id: req.body.id, owner: req.user.username.toLowerCase()})
		res.send(diar)
	} catch (e) { 

		res.status(400).send(e)
	}
})

router.delete('diary/delete/:id', auth, async (req, res) => { 
	if(req.user.username.toLowerCase() !== req.body.owner.toLowerCase() ) {
		return res.status(400).send({error: 'You are not the owner of this diary'})
	}
	try {
		await Diary.findOneAndDelete({id: req.params.id})
		res.send('diary deleted')
	} catch (e) {
		res.status(400).send(e)
	}
})

router.get('/diary/id/:id', async (req, res) => {
	try {
		const diary = await Diary.findOne({id: req.params.id})
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
		console.log(req.params.username)
		const diary = await Diary.find({owner: req.params.username.toLowerCase()})
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
		const diaries = await Diary.find({owner: req.user.username.toLowerCase()})
		res.send(diaries)
	} catch (e) {
		res.status(500).send(e)
	}
})

router.put('/diary/update/:id', auth, async (req, res) => {
	if(req.user.username.toLowerCase() !== req.body.owner.toLowerCase()) {
		return res.status(401).send({ error: 'You are not authorized to update this diary' 
		})}
        
	const updates = Object.keys(req.body)
	const allowedUpdates = ['diaryName', 'type', 'description']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' })
	}

	try {
		const diary = await Diary.findOne({id: req.params.id})

		if (!diary) {
			return res.status(404).send()
		}

		updates.forEach((update) => diary[update] = req.body[update])
		await diary.save()
		res.send(diary)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.put('/diary/picture/:id', auth, async (req, res) => {
	if(req.user.username.toLowerCase() !== req.body.owner.toLowerCase()) {
		return res.status(401).send({ error: 'You are not authorized to update this diary' 
		})}

	try {
		const diary = await Diary.findOne({id: req.params.id})

		if (!diary) {
			return res.status(404).send()
		}

		diary.weeks[req.body.weekNum].pictures.push({picture: req.body.picture})
	
		await diary.save()
		res.send(diary)
	}
	catch (e) {
		res.status(400).send(e)
	}

})
router.put('/diary/week/:id', auth, async (req, res) => {
	if(req.user.username.toLowerCase() !== req.body.owner.toLowerCase()) {
		return res.status(401).send({ error: 'You are not authorized to update this diary' 
		})}

	try {
		const diary = await Diary.findOne({id: req.params.id})
		if (!diary) {
			return res.status(404).send()
		}
		diary.weeks.push({week: req.body.week, weekType: req.body.type})
		await diary.save()
		res.send(diary)
	}
	catch (e) {
		res.status(400).send(e)
	}

})

router.put('/diary/comment/:id', auth, async (req, res) => { 
	try {
		const diary = await Diary.findOne({id: req.params.id})
		if (!diary) {
			return res.status(404).send()
		}
		diary.comments.push({comment: req.body.comment, owner: req.user.username})
		await diary.save()
		res.send(diary)
	}
	catch (e) {
		res.status(400).send(e)
	}
})

router.delete('/diary/week/:id/:index', auth, async (req, res) => {
	try {
		const diary = await Diary.findOne({id: req.params.id})
		if(req.user.username.toLowerCase() !== diary.owner.toLowerCase()) {
			return res.status(401).send({ error: 'You are not authorized to update this diary'
			})}
		if (!diary) {
			return res.status(404).send()
		}
		diary.weeks.splice(req.params.index, 1)
		await diary.save()
		res.send(diary)
	}
	catch (e) {
		res.status(400).send(e)
	}

})

router.delete('/diary/id/:id', auth,  async (req, res) => {
	try {
		const diary = await Diary.findOne({id: req.params.id})
		if(req.user.username.toLowerCase() !== diary.owner.toLowerCase()) {
			return res.status(401).send({ error: 'You are not authorized to update this diary'
			})}
		if (!diary) {
			return res.status(404).send()
		}
		await diary.remove()
		res.send(req.user.username)
	}
	catch (e) {
		res.status(400).send(e)
	}

})

router.delete('diary/:diaryid/comment/:commentid', auth, (req, res) => {
	try {	
		const diary = await Diary.findOne({id: req.params.diaryid})
		if (!diary) {
			return res.status(404).send()
		}
		const comments = diary.comments
		const comment = comments.find(c => c.id === req.params.commentid)
		if(req.user.username.toLowerCase() !== comment.owner.toLowerCase()) {
			return res.status(401).send({ error: 'You are not authorized to update this diary'
			})}
		if (!comment) {
			return res.status(404).send()
		}
		const index = diary.comments.indexOf(comment)
		diary.comments.splice(index, 1)
		await diary.save()
		res.send(diary)
		

	}
	catch (e) {
		res.status(400).send(e)
	}
})

module.exports = router
