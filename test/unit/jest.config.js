module.exports = Object.assign({}, require('../../jest.config.js'), {
  collectCoverageFrom: ['src/**/*.ts', '!src/app.module.ts', '!src/main.ts'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageDirectory: '<rootDir>/coverage/unit',
  setupFiles: ['<rootDir>/test/unit/setup.ts'],
  testMatch: ['**/test/unit/**/*.spec.ts'],
});
