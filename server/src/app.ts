import { default as express } from 'express';
import { default as path } from 'node:path';
import { default as cors } from 'cors';
import { default as yaml } from 'js-yaml';
import { default as fs } from 'node:fs/promises';
import { E2MSettings } from './config.js';
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

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(path.dirname('./www'))));

interface AuthorizeRequest {
    appkey: string;
    scope: string;
}

const onAuthSuccess = (token: EcobeeToken) => {
    console.log(token);
    // TODO: persist token to file
    io.emit('authorized', 'success');
};

const onAuthError = (error: EcobeeAuthError) => {
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
    return res.json(authPin);
});
