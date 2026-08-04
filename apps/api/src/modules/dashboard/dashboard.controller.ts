import { Controller, Get, Query } from '@nestjs/common';

import { DashboardService } from './dashboard.service';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats() {
    return this.dashboardService.getDashboardStats();
  }

  @Get('activity')
  async getActivity(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.dashboardService.getDashboardActivity(isNaN(parsedLimit) ? 10 : parsedLimit);
  }
}
