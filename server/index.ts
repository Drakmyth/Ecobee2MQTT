import express from 'express';
import path from 'path';

const port = 3001;
const app = express();

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

app.use(express.static(path.join(__dirname, './www')));

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});