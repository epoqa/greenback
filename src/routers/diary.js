const express = require('express')

const router = new express.Router()
const Diary = require('../models/diary')
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/diary/create', auth, async (req, res) => {
    try {
        const diary = new Diary({owner: req.user.username, ...req.body})
        await diary.save()
        res.send(diary)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('diary/delete/:id', auth, async (req, res) => { 
    if(req.user.username!==req.body.owner) {
        return res.status(400).send({error: 'You are not the owner of this diary'})
    }
    try {
        const diary = await Diary.findOneAndDelete({_id: req.params.id})
        res.send('diary deleted')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/diary/:id', async (req, res) => {
    try {
        const diary = await Diary.findById(req.params.id)
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
        const diaries = await Diary.find({owner: req.user.username})
        res.send(diaries)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/diary/:owner', async (req, res) => {
    try {
        const diaries = await Diary.find({owner: req.params.owner})
        res.send(diaries)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.put('/diary/update/:id', auth, async (req, res) => {
    if(req.user.username !== req.body.owner) {
        return res.status(401).send({ error: 'You are not authorized to update this diary' 
    })}
        
    const updates = Object.keys(req.body)
    const allowedUpdates = ['diaryName', 'type', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const diary = await Diary.findById(req.params.id)

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

router.put('/diary/picture', auth, async (req, res) => {
    if(req.user.username !== req.body.owner) {
        return res.status(401).send({ error: 'You are not authorized to update this diary' 
    })}

    try {
        const diary = await Diary.findById(req.params.id)

        if (!diary) {
            return res.status(404).send()
        }

        diary.picture = req.body.picture
        await diary.save()
        res.send(diary)
    }
    catch (e) {
        res.status(400).send(e)
    }

})

router.put('/diary/comment/:id', auth, async (req, res) => { 
    try {
        const diary = await Diary.findById(req.params.id)
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


module.exports = router