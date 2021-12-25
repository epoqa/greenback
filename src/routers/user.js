const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
require('dotenv').config()
let refreshTokens = []
router.post('/users/register', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        const refreshToken = jwt.sign({_id: user._id}, process.env.JWT_REFRESH_TOKEN , {expiresIn: '365d'})
        refreshTokens.push(refreshToken)
        res.status(201).send({ user, token, refreshToken })
    } catch (e) {
        res.status(400).send(e)
    }
    
})

router.post('/users/logout', async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        removeItemOnce(refreshTokens, refreshToken);
        res.send({message: 'Logged out'})
    } catch (e) {
        res.status(400).send()
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
        const refreshToken = jwt.sign({_id: user._id}, process.env.JWT_REFRESH_TOKEN , {expiresIn: '365d'})
        refreshTokens.push(refreshToken)
        const token = await user.generateAuthToken()
        
        res.send({ user, token, refreshToken })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/renewAccessToken', (req, res) => {
    const refreshToken = req.body.refreshToken
    if(!refreshToken) {
        return res.status(400).send({ error: 'No refresh token' })
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, async (err, user) => {
        if(err) {
            return res.status(401).send({ error: 'Refresh Token Is Expired' })
        }
        let HasRefreshToken = refreshTokens.includes(refreshToken)

        if(!HasRefreshToken) {
            return res.status(401).send({ error: 'Refresh Token Is Invalid'})
        }
        decoded = jwt.decode(refreshToken)
        token = jwt.sign({ _id: decoded._id }, process.env.JWT_TOKEN, { expiresIn: '6h' })
        res.send({refreshToken, token})
    }   

)})


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

function removeItemOnce(arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    refreshTokens = arr;
}





module.exports = router