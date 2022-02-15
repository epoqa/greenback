const express = require('express')

const app = express()
const PORT = process.env.PORT || 3332

const userRouter = require('./routers/user')
const bodyParser = require('body-parser')
const cors = require('cors')
const diaryRouter = require('./routers/diary')
const mergeRouter = require('./routers/merge')
require('./db/connection')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(
	cors({
		credentials: true,
	})
)

app.use(express.json())
app.use(userRouter)
app.use(diaryRouter)
app.use(mergeRouter)

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`)
})
