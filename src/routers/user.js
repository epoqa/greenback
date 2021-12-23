const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/users/register', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send({ user })
    } catch (e) {
        res.status(400).send(e)
    }
    
})


router.post('/users/login', async (req, res) => {
    //  res.send(req.body)
    try {
        console.log('1')
        const user = await User.findByCredentials(req.body.email, req.body.password)
        console.log('2')

        res.send({ user })
    } catch (e) {
        res.status(400).send()
    }
})



module.exports = router