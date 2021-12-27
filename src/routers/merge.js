const express = require('express')
const User = require('../models/user')
const Diary = require('../models/diary')
const router = new express.Router()
const auth = require('../middleware/auth')


router.get('usersanddiaries/:username ', async (req, res) => {
    try {   
        const user = await User.findOne({username: req.params.username})
        const diary = await Diary.find({user: user._id})
        res.send({user, diary})
    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.get('/meandmine', auth, (req, res) => {
    User.findOne({username: req.user.username})
    .then(user => {
        Diary.find({owner: req.user.username})
        .then(diary => {
            res.send({user, diary})
        })
    })
})





module.exports = router