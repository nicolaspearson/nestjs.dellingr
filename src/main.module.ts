import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApmModule } from '$/apm/apm.module';
import { AppModule } from '$/app/app.module';
import { typedConfigModule } from '$/common/config/typed-config.module';
import { initializeDataSource } from '$/db/data-source/main.data-source';

@Module({
  imports: [
    ApmModule,
    AppModule,
    typedConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: initializeDataSource,
    }),
  ],
})
export class MainModule {}
