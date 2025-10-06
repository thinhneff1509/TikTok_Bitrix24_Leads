module.exports = {
    projects: [
        {
            displayName: 'unit',
            preset: 'ts-jest',
            testEnvironment: 'node',
            testMatch: ['<rootDir>/test/unit/**/*.spec.ts'],
            moduleFileExtensions: ['ts', 'js', 'json'],
            moduleNameMapper: { '^src/(.*)$': '<rootDir>/src/$1' },
        },
        {
            displayName: 'e2e',
            preset: 'ts-jest',
            testEnvironment: 'node',
            testMatch: ['<rootDir>/test/e2e/**/*.e2e-spec.ts'],
            moduleFileExtensions: ['ts', 'js', 'json'],
            moduleNameMapper: { '^src/(.*)$': '<rootDir>/src/$1' },
        },
    ],

    collectCoverage: true,
    collectCoverageFrom: [
        'src/main/service/**/*.ts',
        'src/main/common/utils/**/*.ts',
        '!src/**/__mocks__/**',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    coverageThreshold: {
        global: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
};
