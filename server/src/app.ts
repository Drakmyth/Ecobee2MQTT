import express, { RequestHandler } from 'express';
import path from 'node:path';
import yaml from 'js-yaml';
import fs from 'node:fs/promises';
import { E2MSettings } from './config.js';

const app = express();

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

const apiHandler: RequestHandler = (req, res) => {
    res.json({ message: 'Hello from server!' });
};
app.get('/api', apiHandler);

app.use(express.static(path.join(path.dirname('./www'))));

export default app;
