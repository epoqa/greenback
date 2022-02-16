const express = require('express')
require('dotenv').config()

const cors = require('cors')
const PORT = process.env.PORT || 3332
const bodyParser = require('body-parser')
const app = express()

const allowedOrigins = [
	'capacitor://localhost',
	'ionic://localhost',
	'http://localhost',
	'http://localhost:3000',
	'http://localhost:3001',
	'https://greenfrontt-a0qnnq7np-epoqa.vercel.app', 
	'https://greenfront.vercel.app', 
	'https://greenfront-i6v43afmn-epoqa.vercel.app',
	'https://greenfront-qnvofksc5-epoqa.vercel.app'

]

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
	origin: (origin, callback) => {
		if (allowedOrigins.includes(origin) || !origin) {
			callback(null, true)
		} else {
			callback(new Error('Origin not allowed by CORS'))
		}
	},
}

// Enable preflight requests for all routes
app.options('*', cors(corsOptions))


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