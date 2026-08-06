import { Controller, Get, Query } from '@nestjs/common';

import { AnalyticsService } from './analytics.service';

@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  async getAnalytics(@Query('fresh') fresh?: string) {
    const isFresh = fresh === 'true' || fresh === '1';
    return this.analyticsService.getAnalytics(isFresh);
  }

  @Get('live-orders')
  async getLiveOrders() {
    const analytics = await this.analyticsService.getAnalytics();
    return analytics.liveOrders;
  }
}
