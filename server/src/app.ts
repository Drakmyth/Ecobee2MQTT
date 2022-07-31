import express, { RequestHandler } from 'express';
import path from 'path';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(cors({ origin: true, credentials: true }));

const authorizeHandler: RequestHandler = (req, res) => {
    axios.get('https://api.ecobee.com/authorize', {
        params: {
            response_type: 'ecobeePin',
            client_id: req.query.apikey,
            scope: 'smartWrite'
        }
    }).then((resp) => {
        res.json(resp.data);
    }).catch((error) => {
        console.error(error);
    });
};
app.get('/api/authorize', authorizeHandler);

app.use(express.static(path.join(__dirname, './www')));

export default app;
