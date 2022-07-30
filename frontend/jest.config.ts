import { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: ["node", "node-addons"],
    },
    transform: {
        '^.+\\.vue$': '@vue/vue3-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    moduleFileExtensions: ['json', 'js', 'jsx', 'ts', 'tsx', 'vue'],
    collectCoverageFrom: [
        'src/**/*.{ts,vue}',
        '!src/shims-vue.d.ts',
        '!src/main.ts',
        '!src/router/index.ts' // makes coverage crash, see https://github.com/facebook/jest/issues/13007
    ]
};
export default config;
