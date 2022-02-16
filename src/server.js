const express = require('express')
require('dotenv').config()

// const cors = require('cors')
const PORT = process.env.PORT || 3332
const bodyParser = require('body-parser')
const app = express()

// const corsOptions = {
// 	origin: '*',
// 	credentials: true,
// 	methods: ['GET', 'POST', 'PUT', 'DELETE'],
// 	allowedHeaders: [ 'Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'X-HTTP-Method-Override', 'Accept-Language', 'Accept-Encoding', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials' ]
// }
// app.use(
// 	cors(corsOptions)
// )
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
	res.setHeader('Access-Control-Allow-Credentials', true)
	next()
})
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json())

// app.all('*', function(req, res, next) {
// 	res.header('Access-Control-Allow-Origin', '*')
// 	res.header('Access-Control-Allow-Headers', 'X-Requested-With')
// 	res.header('Access-Control-Allow-Headers', 'Content-Type')
// 	next()
// })


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