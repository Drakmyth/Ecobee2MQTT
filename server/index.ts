import express from 'express';

const port = 3001;
const app = express();

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});