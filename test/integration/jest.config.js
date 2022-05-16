module.exports = Object.assign({}, require(`../../jest.config.js`), {
  collectCoverageFrom: [
    'src/**/*.controller.ts',
    'src/**/*.dto.ts',
    'src/**/*.module.ts',
    'src/**/*.repository.ts',
    'src/**/*.service.ts',
    '!src/common/config/database/database.config.service.ts',
    '!src/**/*-seeder.service.ts',
    '!src/main.module.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageDirectory: '<rootDir>/coverage/integration',
  setupFiles: ['<rootDir>/test/integration/setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/integration/setup-test-runner.ts'],
  testMatch: ['**/test/integration/**/*.spec.ts'],
});
