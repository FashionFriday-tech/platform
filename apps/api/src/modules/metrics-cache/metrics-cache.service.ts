import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MetricsCacheService {
  private readonly logger = new Logger(MetricsCacheService.name);

  // High-precision epoch timestamps for cache invalidation
  private ordersEpoch: number = Date.now();
  private productsEpoch: number = Date.now();

  getOrdersEpoch(): number {
    return this.ordersEpoch;
  }

  getProductsEpoch(): number {
    return this.productsEpoch;
  }

  invalidateOrders(): void {
    this.ordersEpoch = Date.now();
    this.logger.log(`[MetricsCache] Orders metrics invalidated (epoch: ${this.ordersEpoch})`);
  }

  invalidateProducts(): void {
    this.productsEpoch = Date.now();
    this.logger.log(`[MetricsCache] Products metrics invalidated (epoch: ${this.productsEpoch})`);
  }

  invalidateAll(): void {
    const now = Date.now();
    this.ordersEpoch = now;
    this.productsEpoch = now;
    this.logger.log(`[MetricsCache] All metrics caches invalidated (epoch: ${now})`);
  }
}
