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

export class E2MSettings {
    bridge: E2MBridgeSettings = {
        port: 3001,
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

    static getDefaults = () => {
        return new E2MSettings();
    };
}

declare global {
    var CONFIG: E2MSettings;
}
