import { Connection } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from '$/app/app.service';
import { AwsS3SeederService } from '$/aws/s3-seeder/aws-s3-seeder.service';
import { DatabaseSeederService } from '$/db/services/database-seeder.service';

import { awsS3SeederMockService, databaseSeederMockService } from '#/utils/mocks/service.mock';

describe('App Service', () => {
  let module: TestingModule;
  let service: AppService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: AwsS3SeederService,
          useValue: awsS3SeederMockService,
        },
        {
          provide: DatabaseSeederService,
          useValue: databaseSeederMockService,
        },
        AppService,
      ],
    }).compile();
    service = module.get<AppService>(AppService);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed', () => {
    const connection = {} as unknown as Connection;
    afterEach(() => {
      process.env.SEED_ENVIRONMENT = 'true';
    });

    test('should not seed if SEED_ENVIRONMENT is set to false', async () => {
      process.env.SEED_ENVIRONMENT = 'false';
      await service.seed(connection);
      expect(awsS3SeederMockService.seed).not.toHaveBeenCalled();
      expect(databaseSeederMockService.seed).not.toHaveBeenCalled();
    });

    test('should seed if SEED_ENVIRONMENT is set to true', async () => {
      process.env.SEED_ENVIRONMENT = 'true';
      await service.seed(connection);
      expect(awsS3SeederMockService.seed).toHaveBeenCalledTimes(1);
      expect(databaseSeederMockService.seed).toHaveBeenCalledWith(connection);
    });
  });
});
