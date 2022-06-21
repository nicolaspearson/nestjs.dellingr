import { Module } from '@nestjs/common';

import { newRelicProvider } from '$/apm/providers/newrelic.provider';

@Module({
  providers: [newRelicProvider],
  exports: [newRelicProvider],
})
export class ApmModule {}
