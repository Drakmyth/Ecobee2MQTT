import { default as yaml } from 'js-yaml';
import { default as fs } from 'node:fs/promises';

interface E2MBridgeSettings {
    port: number,
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

interface E2MEcobeeAuth {
    appkey: string,
    refresh_token: string;
}

const settingsFilePath = './config/settings.yaml';
const secretsFilePath = './config/secrets.yaml';

const loadFromFile = async <T>(path: string, getDefaults: () => T): Promise<T> => {
    let retVal: T;

    await fs.readFile(path, 'utf-8')
        .then(data => {
            retVal = yaml.load(data) as T;
            console.log('Loaded config file');
        })
        .catch(async err => {
            retVal = getDefaults();
            if (err && err.code === 'ENOENT') {
                saveToFile(path, retVal);
            } else {
                console.error(err);
            }
        });

    return retVal!;
};

const saveToFile = async <T>(path: string, data: T): Promise<void> => {
    const fileContents = yaml.dump(data, {
        skipInvalid: true
    });
    await fs.writeFile(path, fileContents, 'utf-8')
        .then(() => {
            console.log('Created default config file');
        })
        .catch(err => {
            console.error(err);
        });
};

export const loadSettings = (): Promise<E2MSettings> => loadFromFile(settingsFilePath, () => new E2MSettings());
export const loadSecrets = (): Promise<E2MSecrets> => loadFromFile(secretsFilePath, () => new E2MSecrets());
export const saveSettings = (data: E2MSettings): Promise<void> => saveToFile(settingsFilePath, data);
export const saveSecrets = (data: E2MSecrets): Promise<void> => saveToFile(secretsFilePath, data);

export class E2MSettings {
    public bridge: E2MBridgeSettings = {
        port: 3001,
        enable_auth: false,
        enable_https: false
    };
    public ecobee: E2MEcobeeSettings = {};
    public mqtt: E2MMQTTSettings = {
        broker: '',
        use_credentials: false,
        use_ssl: false,
        topic_prefix: 'ecobee2mqtt',
        retain: false,
        qos: 0
    };
}

export class E2MSecrets {
    public ecobee_auth: E2MEcobeeAuth = {
        appkey: '',
        refresh_token: ''
    };
}

declare global {
    var CONFIG: E2MSettings;
    var SECRETS: E2MSecrets;
}
