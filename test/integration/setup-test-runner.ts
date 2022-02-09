import { TestRunner } from '#/integration/test-runner';

// Setup the application.
beforeAll(async () => {
  await TestRunner.getInstance();
});

// Teardown the application.
afterAll(async () => {
  const instance = await TestRunner.getInstance();
  await instance.close();
});
