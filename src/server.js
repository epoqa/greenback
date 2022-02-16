const express = require('express')
require('dotenv').config()

const cors = require('cors')
const PORT = process.env.PORT || 3332
const bodyParser = require('body-parser')
const app = express()

const corsOptions = {
	origin: '*',
	credentials: true,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	allowedHeaders: 'Content-Type, Authorization, Content-Length, X-Requested-With' 
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