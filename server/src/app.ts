import { default as express } from 'express';
import { default as path } from 'node:path';
import { default as cors } from 'cors';
import { loadSecrets, loadSettings, saveSecrets } from './config.js';
import { Server } from 'socket.io';
import { default as http } from 'node:http';
import { default as bodyParser } from 'body-parser';
import { authorize as authorizeEcobee, EcobeeAuthError, EcobeeToken } from './services/ecobee.js';

const app = express();
export const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', client => {
    console.log('client connected');
    client.on('disconnect', () => {
        console.log('client disconnected');
    });
});

let settings = await loadSettings();
let secrets = await loadSecrets();

globalThis.CONFIG = settings;
globalThis.SECRETS = secrets;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(path.dirname('./www'))));

interface AuthorizeRequest {
    appkey: string;
    scope: string;
}

const onAuthSuccess = async (appkey: string, token: EcobeeToken): Promise<void> => {
    console.log(token);
    globalThis.SECRETS.ecobee_auth = {
        appkey,
        refresh_token: token.refresh_token
    };
    await saveSecrets(globalThis.SECRETS);
    io.emit('authorized', 'success');
};

const onAuthError = (error: EcobeeAuthError): void => {
    console.log(error);
};

app.post('/api/authorization', async (req, res) => {
    console.log('\nInitiate Authorization Process...');
    const body = req.body as AuthorizeRequest;
    const authPin = await authorizeEcobee(body.appkey, body.scope, {
        onSuccess: onAuthSuccess,
        onError: onAuthError
    });
    console.log(authPin);
    return res.status(201).json(authPin);
});

app.get('/api/authorization', (_, res) => {
    const appkey = globalThis.SECRETS.ecobee_auth.appkey;
    if (appkey.length > 0) {
        return res.status(200).json({ appkey });
    }

    return res.sendStatus(404);
});

app.delete('/api/authorization', async (_, res) => {
    globalThis.SECRETS.ecobee_auth = {
        appkey: '',
        refresh_token: ''
    };
    await saveSecrets(globalThis.SECRETS);
    return res.sendStatus(200);
});
