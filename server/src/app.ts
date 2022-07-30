import express, { RequestHandler } from 'express';
import path from 'path';

const app = express();

const apiHandler: RequestHandler = (req, res) => {
    res.json({ message: 'Hello from server!' });
};
app.get('/api', apiHandler);

app.use(express.static(path.join(__dirname, './www')));

export default app;
