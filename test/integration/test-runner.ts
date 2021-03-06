import { oneLine } from 'common-tags';
import helmet from 'helmet';
import pMemoize from 'p-memoize';
import { default as request } from 'supertest';
import { DataSource } from 'typeorm';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppModule } from '$/app/app.module';
import { AppService } from '$/app/app.service';
import { API_GLOBAL_PREFIX } from '$/common/constants';
import { JwtResponse, LoginRequest } from '$/common/dto';
import { ErrorFilter } from '$/common/filters/error.filter';
import { DtoValidationPipe } from '$/common/pipes/dto-validation.pipe';
import { dataSource, initializeDataSource } from '$/db/data-source/main.data-source';
import { DEFAULT_PASSWORD, userFixtures } from '$/db/fixtures/user.fixture';

import { typedConfigModule } from '#/utils/config';

/**
 * The TestRunner class is responsible for providing
 * setup and teardown logic for integration tests.
 *
 * A new instance should be created for every integration
 * test suite. Data is isolated between instances by
 * using a unique database schema for each one.
 *
 * The TestRunner instance returns the created NestJS
 * Application, and a dataSource to the database via
 * TypeORM.
 *
 * @example
 *
 * let runner: TestRunner;
 *
 * beforeAll(async () => {
 *   runner = await TestRunner.getInstance();
 * });

 * afterAll(async () => {
 *   await runner.close();
 * });
 *
 */
export class TestRunner {
  private memoizeCreateJwt = pMemoize(this.createJwt);

  private static instance: TestRunner;

  constructor(readonly application: INestApplication, readonly dataSource: DataSource) {}

  /**
   * Fetches an instance of the {@link TestRunner} class.
   *
   * If an instance does not exist yet, one will be created.
   *
   * @returns An instance of the {@link TestRunner} class
   */
  public static async getInstance(): Promise<TestRunner> {
    if (!TestRunner.instance) {
      TestRunner.instance = await TestRunner.create();
    }
    return TestRunner.instance;
  }

  /**
   * Creates a new {@link TestRunner} instance.
   *
   * @returns A new instance of the {@link TestRunner} class
   */
  private static async create(): Promise<TestRunner> {
    // Disable database logging
    dataSource.setOptions({
      logging: false,
    });

    // Create the testing module
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        typedConfigModule,
        TypeOrmModule.forRootAsync({
          useFactory: initializeDataSource,
        }),
      ],
    }).compile();

    await dataSource.query(oneLine`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    // Create and configure the application
    const application = module.createNestApplication();
    application.setGlobalPrefix(API_GLOBAL_PREFIX);
    application.enableCors({
      credentials: true,
      methods: 'DELETE,HEAD,GET,OPTIONS,PATCH,POST,PUT',
      origin: [/localhost$/],
    });
    application.use(helmet());
    application.useGlobalFilters(new ErrorFilter());
    application.useGlobalPipes(new DtoValidationPipe());
    application.useLogger(false);

    // Seed and initialize the application
    await application.get<AppService>(AppService).seed();
    await application.init();

    return new TestRunner(application, dataSource);
  }

  /**
   * Closes the database connection and application.
   */
  public async close(): Promise<void> {
    await this.dataSource.destroy();
    await this.application.close();
  }

  /**
   * Get a JWT for the provided user.
   *
   * If a dto is not provided, the first user fixture
   * from the database seeding process is used instead.
   *
   * @param data The optional {@link LoginRequest} dto.
   * @returns A {@link JwtResponse} object.
   */
  public async getJwt(data?: LoginRequest): Promise<JwtResponse> {
    return this.memoizeCreateJwt(
      data ??
        ({
          email: userFixtures[0].email,
          password: DEFAULT_PASSWORD,
        } as LoginRequest),
    );
  }

  /**
   * Create a new JWT via the API for the provided user.
   *
   * @param data The {@link LoginRequest} dto.
   * @returns A {@link JwtResponse} object.
   */
  private async createJwt(data: LoginRequest): Promise<JwtResponse> {
    const res = await request(this.application.getHttpServer())
      .post(`${API_GLOBAL_PREFIX}/auth/login`)
      .send({
        email: data.email,
        password: data.password,
      } as LoginRequest);
    return res.body as JwtResponse;
  }
}
