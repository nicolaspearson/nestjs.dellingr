import { oneLine } from 'common-tags';
import helmet from 'helmet';
import pMemoize from 'p-memoize';
import { default as request } from 'supertest';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';

import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppModule } from '$/app/app.module';
import { AppService } from '$/app/app.service';
import { getValidationSchema } from '$/common/config/environment.config';
import { TypeOrmConfigService } from '$/common/config/typeorm.config';
import { API_GLOBAL_PREFIX } from '$/common/constants';
import { JwtResponse, LoginRequest } from '$/common/dto';
import { ErrorFilter } from '$/common/filters/error.filter';
import { DtoValidationPipe } from '$/common/pipes/dto-validation.pipe';
import { DEFAULT_PASSWORD, userFixtures } from '$/db/fixtures/user.fixture';

import { NoOutputLogger } from './no-output.logger';

export class TestRunner {
  private memoizeCreateJwt = pMemoize(this.createJwt);

  constructor(readonly application: INestApplication, readonly connection: Connection) {}

  /**
   * Configure the database and create a new connection.
   *
   * @param schema The name of the database schema.
   * @returns A new database {@link Connection}.
   */
  private static async connectToDatabase(schema: string): Promise<Connection> {
    // Create the default connection options
    const connectionOptions = TypeOrmConfigService.creatConnectionOptions();

    // Connect to the database using the public schema and configure it
    const connection = await createConnection({
      ...connectionOptions,
      logging: false,
      schema: 'public',
    } as ConnectionOptions);
    await connection.query(oneLine`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP SCHEMA IF EXISTS ${schema} CASCADE;
    CREATE SCHEMA IF NOT EXISTS ${schema};
  `);
    await connection.close();

    // Create a new connection using the specified schema
    return createConnection({ ...connectionOptions, logging: false, schema } as ConnectionOptions);
  }

  private async createJwt(data: LoginRequest): Promise<JwtResponse> {
    const res = await request(this.application.getHttpServer())
      .post(`${API_GLOBAL_PREFIX}/auth/login`)
      .send({
        email: data.email,
        password: data.password,
      } as LoginRequest);
    return res.body as JwtResponse;
  }

  /**
   * Creates a new test runner instance.
   *
   * @param options The {@link TestRunner} options.
   * @returns A new instance of the {@link TestRunner}
   */
  public static async create(options: { schema: string }): Promise<TestRunner> {
    // Configure the database and create a connection
    const connection = await TestRunner.connectToDatabase(options.schema);

    // Create the testing module
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: false,
          validationSchema: getValidationSchema(),
        }),
        TypeOrmModule.forRoot(connection.options),
      ],
    })
      .setLogger(new NoOutputLogger())
      .compile();

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

    // Seed and initialize the application
    await application.get<AppService>(AppService).seed(connection);
    await application.init();

    return new TestRunner(application, connection);
  }

  /**
   * Closes the database connection and application.
   */
  async close(): Promise<void> {
    await this.connection.close();
    await this.application.close();
  }

  /**
   * Get a JWT for the provided user.
   *
   * @param data The {@link LoginRequest} dto.
   * @returns A {@link JwtResponse} object.
   */
  async getJwt(data?: LoginRequest): Promise<JwtResponse> {
    return this.memoizeCreateJwt(
      data ??
        ({
          email: userFixtures[0].email,
          password: DEFAULT_PASSWORD,
        } as LoginRequest),
    );
  }
}
