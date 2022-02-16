const express = require('express')
require('dotenv').config()
const domainsFromEnv = process.env.CORS_DOMAINS || ''
const whitelist = domainsFromEnv.split(',').map(item => item.trim())

console.log(whitelist)


const cors = require('cors')
const PORT = process.env.PORT || 3332
const bodyParser = require('body-parser')
const app = express()

const corsOptions = {
	origin: function (origin, callback) {
		if (!origin || whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
	credentials: true,
}
app.use(
	cors(corsOptions)
)

app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json())


const userRouter = require('./routers/user')
const diaryRouter = require('./routers/diary')
const mergeRouter = require('./routers/merge')
require('./db/connection')




app.use(express.json())
app.use(userRouter)
app.use(diaryRouter)
app.use(mergeRouter)

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`)
})