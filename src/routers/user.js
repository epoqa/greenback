const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

router.post('/users/register', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
    
})

router.get('/allusers', auth, async(req,res) => {
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

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send("user doesn't exist")
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }

})



router.post('/users/login', async (req, res) => {
    try {

        const user = await User.findOne({email: req.body.email});

        if(!user) {
            return res.status(400).send({error: 'User with that email does not exist'})
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isMatch) {
            return res.status(400).send({error: 'Invalid password'})
        }
        const token = await user.generateAuthToken()
        
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})





module.exports = router