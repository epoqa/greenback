const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/users/register', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        // Generate JWT
        res.status(201).send({ user })
    } catch (e) {
        res.status(400).send(e)
    }
    
})


router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email, password: req.body.password})
        // Generate JWT
        res.send({ user })
    } catch (e) {
        res.status(400).send()
    }
})





module.exports = router