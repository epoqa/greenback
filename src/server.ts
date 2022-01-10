import express, { Application, Request, Response, NextFunction } from 'express';

// Routers
import bodyParser from 'body-parser';
import cors from 'cors';
import userRouter from './routers/user';
import mergeRouter from './routers/merge';
import { diaryRouter } from './routers/diary';

// Modules
import './db/connection';

const app: Application = express();
const PORT = process.env.PORT || 3333;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(diaryRouter);
app.use(mergeRouter);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
