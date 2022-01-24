import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from '$/health/health.controller';

import { healthCheckResponseMock } from '#/utils/fixtures';

describe('Health Controller', () => {
  let module: TestingModule;
  let controller: HealthController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();
    controller = module.get<HealthController>(HealthController);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    test('should return status ok', () => {
      expect(controller.getHealth()).toEqual(healthCheckResponseMock);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
