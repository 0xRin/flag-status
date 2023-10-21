// library imports
import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';

// initialize express app
const app : Express = express();
dotenv.config();

// define port
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('🔥 It\'s working');
});

app.listen(PORT, () => {
    console.log(`😎[server]: Server is running on port ${PORT}`)
});