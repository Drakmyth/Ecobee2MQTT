import express, { RequestHandler } from 'express';
import * as path from 'node:path';
// import path from 'node:path';
import cors from 'cors';
import * as yaml from 'js-yaml';
import * as fs from 'node:fs/promises';
import { E2MSettings } from './config.js';
import { Server } from 'socket.io';
import * as http from 'node:http';
import * as bodyParser from 'body-parser';
import fetch from 'node-fetch';
import * as ecobee from './services/ecobee.js';

const app = express();
export const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors({ origin: true, credentials: true }));

const settingsFilePath = './config/settings.yaml';
let settings = E2MSettings.getDefaults();
let authorizeInterval: NodeJS.Timer;

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

interface AuthorizeRequest {
    appkey: string;
    scope: string;
}

class AuthorizeResponse {
    constructor(public pin: string, public expires_in: number) { }
}

interface EcobeeAuthorizeResponse {
    ecobeePin: string,
    expires_in: number,
    code: string,
    scope: string,
    interval: number;
}

interface EcobeeTokenResponse {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string;
}

interface EcobeeAuthError {
    error: string,
    error_description: string,
    error_uri: string;
}

class EcobeeTokenRequestQuery {
    constructor(public grant_type: string, public code: string, public client_id: string, public ecobee_type: string) { }
}

type AuthErrors = 'access_denied' | 'invalid_request' | 'invalid_client' | 'invalid_grant' | 'unauthorized_client' | 'unsupported_grant_type' | 'invalid_scope' | 'not_supported' | 'account_locked' | 'account_disabled' | 'authorization_pending' | 'authorization_expired' | 'slow_down';

const authorizeHandler: RequestHandler = async (req, res) => {
    console.log('\nInitiate Authorization Process...');
    const body = req.body as AuthorizeRequest;
    const params = new URLSearchParams({
        response_type: 'ecobeePin',
        client_id: body.appkey,
        scope: body.scope
    });
    console.log(params);

    const response = await fetch('https://api.ecobee.com/authorize?' + params);
    if (response.status >= 300) {
        const error = await response.json() as EcobeeAuthError;
        console.log('Error Initializing Authorization');
        console.log(error);
        return res.json(error);
    }

    console.log('Authorization Initiated');
    const data = await response.json() as EcobeeAuthorizeResponse;
    console.log(data);
    authorizeInterval = setInterval(async () => {
        await tryGetToken(data.code, body.appkey);
    }, data.interval * 1000);
    const authresponse = new AuthorizeResponse(data.ecobeePin, data.expires_in);
    console.log(authresponse);
    return res.json(authresponse);
};

const tryGetToken = async (authcode: string, appkey: string) => {
    console.log(`\nVerifying Authorization: ${authcode}...`);
    const params = new URLSearchParams({
        grant_type: 'ecobeePin',
        code: authcode,
        client_id: appkey,
        ecobee_type: 'jwt'
    });

    const response = await fetch('https://api.ecobee.com/token?' + params, { method: 'POST' });
    if (response.status >= 300) {
        const error = await response.json() as EcobeeAuthError;
        console.log('Authorization Not Complete');
        console.log(error);
        if (error.error as AuthErrors !== 'authorization_pending') {
            clearInterval(authorizeInterval);
        }
        return;
    }

    console.log('Authorization Verified');
    const data = await response.json() as EcobeeTokenResponse;
    console.log(data);
    // TODO: persist token to file
    io.emit('authorized', 'success');
    clearInterval(authorizeInterval);
};

app.use(bodyParser.json());
app.use(express.static(path.join(path.dirname('./www'))));
app.post('/api/authorize', authorizeHandler);

io.on('connection', client => {
    console.log('client connected');
    client.on('disconnect', () => {
        console.log('client disconnected');
    });
});
