import { Global, Module } from '@nestjs/common';

import { MetricsCacheService } from './metrics-cache.service';

@Global()
@Module({
  providers: [MetricsCacheService],
  exports: [MetricsCacheService],
})
export class MetricsCacheModule {}
