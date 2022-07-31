import express, { RequestHandler } from 'express';
import path from 'node:path';
import yaml, { YAMLException } from 'js-yaml';
import fs from 'node:fs/promises';

const app = express();

interface E2MBridgeSettings {
    enable_auth: boolean,
    enable_https: boolean;
}

interface E2MEcobeeSettings { }

interface E2MMQTTSettings {
    broker: string,
    use_credentials: boolean,
    use_ssl: boolean,
    topic_prefix: string,
    retain: boolean,
    qos: number;
}

class E2MSettings {
    bridge: E2MBridgeSettings = {
        enable_auth: false,
        enable_https: false
    };
    ecobee: E2MEcobeeSettings = {};
    mqtt: E2MMQTTSettings = {
        broker: '',
        use_credentials: false,
        use_ssl: false,
        topic_prefix: 'ecobee2mqtt',
        retain: false,
        qos: 0
    };
}

const default_settings = new E2MSettings();
const settingsFilePath = './config/settings.yaml';
let settings = default_settings;

await fs.readFile(settingsFilePath, 'utf-8')
    .then(data => {
        settings = yaml.load(data) as E2MSettings;
    })
    .catch(error => {
        console.error(error);
    });

console.log(settings);

const apiHandler: RequestHandler = (req, res) => {
    res.json({ message: 'Hello from server!' });
};
app.get('/api', apiHandler);

app.use(express.static(path.join(path.dirname('./www'))));

export default app;
