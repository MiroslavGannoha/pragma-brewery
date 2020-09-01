module.exports = {
    preset: 'ts-jest',
    clearMocks: true,
    testEnvironment: 'node',
    snapshotSerializers: ['enzyme-to-json/serializer'],
    setupFiles: ['./test/setupTests.ts'],
};
