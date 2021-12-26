const express = require('express')

const app = express();
const PORT = process.env.PORT || 3331;

const userRouter = require('./routers/user');
const bodyParser = require('body-parser');
const cors = require('cors')
const diaryRouter = require('./routers/diary');
require('./db/connection');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(cors())

app.use(express.json());
app.use(userRouter); 
app.use(diaryRouter);
 
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
