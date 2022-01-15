import express from 'express';
// Routers
import bodyParser from 'body-parser';
import cors from 'cors';
import { diaryRouter } from './routers/diary';
import { userRouter } from './routers/user';
import { mergeRouter } from './routers/merge';
// Modules
import './db/connection';
const app = express();
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
