import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppModule } from '$/app/app.module';
import { getValidationSchema } from '$/common/config/environment.config';
import { TypeOrmConfigService } from '$/common/config/typeorm.config';

@Module({
  imports: [
    AppModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      validationSchema: getValidationSchema(),
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
})
export class MainModule {}
