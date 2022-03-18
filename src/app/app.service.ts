import { DataSource } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';

import { AwsS3SeederService } from '$/aws/s3-seeder/aws-s3-seeder.service';
import { DatabaseSeederService } from '$/db/services/database-seeder.service';

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger(AppService.name);

  constructor(
    private readonly awsS3SeederService: AwsS3SeederService,
    private readonly databaseSeederService: DatabaseSeederService,
  ) {
    this.logger.debug('App service created!');
  }

  async seed(dataSource: DataSource): Promise<void> {
    this.logger.debug('Seeding environment...');
    // Seed the database with fixtures.
    await this.databaseSeederService.seed(dataSource);
    // Seed AWS S3 with the default bucket.
    await this.awsS3SeederService.seed();
  }
}
