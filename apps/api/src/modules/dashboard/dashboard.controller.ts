import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { DashboardService } from './dashboard.service';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, AdminGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Query('fresh') fresh?: string) {
    const isFresh = fresh === 'true' || fresh === '1';
    return this.dashboardService.getDashboardStats(isFresh);
  }

  @Get('activity')
  async getActivity(@Query('limit') limit?: string, @Query('fresh') fresh?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const isFresh = fresh === 'true' || fresh === '1';
    return this.dashboardService.getDashboardActivity(
      isNaN(parsedLimit) ? 10 : parsedLimit,
      isFresh,
    );
  }
}
