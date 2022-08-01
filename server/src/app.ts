import express, { RequestHandler } from 'express';
import path from 'node:path';
import axiosPkg from 'axios';
const { Axios } = axiosPkg;
import cors from 'cors';
import yaml from 'js-yaml';
import fs from 'node:fs/promises';
import { E2MSettings } from './config.js';
import { Server } from 'socket.io';
import http from 'node:http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const axios = new Axios();

app.use(cors({ origin: true, credentials: true }));

const settingsFilePath = './config/settings.yaml';
let settings = E2MSettings.getDefaults();

await fs.readFile(settingsFilePath, 'utf-8')
    .then(data => {
        settings = yaml.load(data) as E2MSettings;
        console.log('Loaded config file');
    })
    .catch(async err => {
        if (err && err.code === 'ENOENT') {
            const fileContents = yaml.dump(settings);
            await fs.writeFile(settingsFilePath, fileContents, 'utf-8')
                .then(() => {
                    console.log('Created default config file');
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            console.error(err);
        }
    });

globalThis.CONFIG = settings;

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

const tokenHandler: RequestHandler = (req, res) => {
    axios.post('https://api.ecobee.com/token', {}, {
        params: {
            grant_type: 'ecobeePin',
            code: '<AUTHCODE>',
            client_id: '<APPKEY>',
            ecobee_type: 'jwt'
        }
    }).then(resp => {
        console.log(resp);
    }).catch(error => {
        console.log(error);
    });
};

app.get('/api/authorize', authorizeHandler);
app.get('/api/token', tokenHandler);

app.use(express.static(path.join(path.dirname('./www'))));

io.on('connection', client => {
    console.log('client connected');
    client.emit('hello', 'Hello from server!');
    client.on('event', data => {
        console.log(data);
    });
    client.on('disconnect', () => {
        console.log('client disconnected');
    });
});

export default server;
