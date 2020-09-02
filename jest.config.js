module.exports = {
    preset: 'ts-jest',
    clearMocks: true,
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./test/setupAfterEnv.ts'],
};
