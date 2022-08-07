import type { Config } from '@jest/types';
import { default as jest } from 'jest';

const config: Config.InitialOptions = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            useESM: true
        }
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/server.ts'
    ],
    extensionsToTreatAsEsm: ['.ts'],
    silent: true
};
export default config;
