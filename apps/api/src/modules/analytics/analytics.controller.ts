import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AnalyticsService } from './analytics.service';

@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  async getAnalytics(@Query('fresh') fresh?: string) {
    const isFresh = fresh === 'true' || fresh === '1';
    return this.analyticsService.getAnalytics(isFresh);
  }

  @Get('live-orders')
  async getLiveOrders(@Query('fresh') fresh?: string) {
    const isFresh = fresh === 'true' || fresh === '1';
    const analytics = await this.analyticsService.getAnalytics(isFresh);
    return analytics.liveOrders;
  }
}
