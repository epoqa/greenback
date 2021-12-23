const express = require('express')

const app = express();
const PORT = process.env.PORT || 3333;
require('./db/connection');

const userRouter = require('./routers/user');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

const cors = require('cors')
app.use(cors())

app.use(express.json());
app.use(userRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
