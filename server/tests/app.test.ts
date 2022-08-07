import { server } from '../src/app.js';
import request from 'supertest';

describe('GET /api/authorization', () => {
    const endpoint = '/api/authorization';

    test('Returns 200 with ecobee authorization', async () => {
        globalThis.SECRETS = {
            ecobee_auth: {
                appkey: 'abcd',
                refresh_token: 'abcd'
            }
        };

        const result = await request(server).get(endpoint);
        expect(result.statusCode).toEqual(200);
    });

    test('Returns 404 without ecobee authorization', async () => {
        globalThis.SECRETS = {
            ecobee_auth: {
                appkey: '',
                refresh_token: ''
            }
        };

        const result = await request(server).get(endpoint);
        expect(result.statusCode).toEqual(404);
    });
});
