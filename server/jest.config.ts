import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            useESM: true,
            diagnostics: {
                ignoreCodes: ['TS151001'],
            },
        }
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    extensionsToTreatAsEsm: ['.ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/server.ts'
    ],
    silent: true
};
export default config;
