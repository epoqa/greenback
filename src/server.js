const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 3332
const bodyParser = require('body-parser')

const app = express()
app.use(
	cors({
		origin : "*",
	})
)

app.use(bodyParser.urlencoded({extended : true}))
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

