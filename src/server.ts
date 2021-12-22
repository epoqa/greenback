import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();
const PORT = process.env.PORT || 3333;

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!');
});
console.log('asf');

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
