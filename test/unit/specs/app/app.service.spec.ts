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

    test('should seed the environment correctly', async () => {
      await service.seed(connection);
      expect(awsS3SeederMockService.seed).toHaveBeenCalledTimes(1);
      expect(databaseSeederMockService.seed).toHaveBeenCalledWith(connection);
    });
  });
});
