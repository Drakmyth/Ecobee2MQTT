import { default as fetch } from 'node-fetch';

export interface EcobeeAuthError {
    error: string,
    error_description: string,
    error_uri: string;
}

interface EcobeeAuthorizeResponse {
    ecobeePin: string,
    expires_in: number,
    code: string,
    scope: string,
    interval: number;
}

export interface EcobeeToken {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string;
}

type AuthErrors = 'access_denied' | 'invalid_request' | 'invalid_client' | 'invalid_grant' | 'unauthorized_client' | 'unsupported_grant_type' | 'invalid_scope' | 'not_supported' | 'account_locked' | 'account_disabled' | 'authorization_pending' | 'authorization_expired' | 'slow_down';

export interface AuthorizationPin {
    pin: string,
    expires_in: number;
}

let authorizeInterval: NodeJS.Timer;

export interface AuthorizeOptions {
    onSuccess: (token: EcobeeToken) => void,
    onError?: (error: EcobeeAuthError) => void;
}

export const authorize = async (appkey: string, scope: string, opts: AuthorizeOptions): Promise<AuthorizationPin> => {
    clearInterval(authorizeInterval);
    
    const params = new URLSearchParams({
        response_type: 'ecobeePin',
        client_id: appkey,
        scope: scope
    });

    const response = await fetch('https://api.ecobee.com/authorize?' + params);
    if (response.status >= 300) {
        const error = await response.json() as EcobeeAuthError;
        throw error;
    };

    const data = await response.json() as EcobeeAuthorizeResponse;
    authorizeInterval = setInterval(() => tryGetToken(data.code, appkey, opts), data.interval * 1000);

    return {
        pin: data.ecobeePin,
        expires_in: data.expires_in
    };
};

const tryGetToken = async (authcode: string, appkey: string, opts: AuthorizeOptions) => {
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
        if (error.error as AuthErrors !== 'authorization_pending') {
            console.log('Authorization Failed');
            clearInterval(authorizeInterval);
            if (opts.onError) {
                opts.onError(error);
            }
        }
        return;
    }

    console.log('Authorization Verified');
    const token = await response.json() as EcobeeToken;
    clearInterval(authorizeInterval);
    opts.onSuccess(token);
};
