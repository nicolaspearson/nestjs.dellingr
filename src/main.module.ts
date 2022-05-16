import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppModule } from '$/app/app.module';
import { DatabaseConfigService } from '$/common/config/database/database.config.service';
import { createTypedConfigModule } from '$/common/config/typed-config.module';

@Module({
  imports: [
    AppModule,
    createTypedConfigModule(),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
  ],
})
export class MainModule {}
