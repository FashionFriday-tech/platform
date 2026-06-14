import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard';
import { SearchLogsService } from './search-logs.service';

interface AuthRequest extends Request {
  user?: { id?: string; sub?: string };
}

@Controller('search-logs')
export class SearchLogsController {
  constructor(private readonly service: SearchLogsService) {}

  // Public endpoint with optional auth — logs what the user searched
  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  async logSearch(@Body('query') query: string, @Req() req: AuthRequest) {
    if (!query?.trim()) return { success: false };
    const userId = req.user?.id ?? req.user?.sub ?? undefined;
    await this.service.logSearch(query, userId);
    return { success: true };
  }

  // Admin endpoint — get all search logs
  @Get('admin')
  async getAllSearchLogs() {
    return this.service.getAllSearchLogs();
  }
}
