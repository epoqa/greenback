const express = require('express')

const app = express();
const PORT = process.env.PORT || 3333;

const userRouter = require('./routers/user');
const bodyParser = require('body-parser');
const cors = require('cors')

require('./db/connection');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(cors())

app.use(express.json());
app.use(userRouter); 
 
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
