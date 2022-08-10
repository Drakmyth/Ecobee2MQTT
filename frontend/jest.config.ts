import { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: ["node", "node-addons"],
    },
    globals: {
        'ts-jest': {
            useESM: true,
            diagnostics: {
                ignoreCodes: ['TS151001'],
            },
        }
    },
    transform: {
        '^.+\\.vue$': '@vue/vue3-jest',
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    moduleFileExtensions: ['json', 'js', 'jsx', 'ts', 'tsx', 'vue'],
    extensionsToTreatAsEsm: ['.ts'],
    collectCoverageFrom: [
        'src/**/*.{ts,vue}',
        '!src/shims-vue.d.ts',
        '!src/main.ts',
        '!src/router/index.ts' // makes coverage crash, see https://github.com/facebook/jest/issues/13007
    ],
    silent: true
};
export default config;
