import { Controller, Get } from '@nestjs/common';

import { PrismaService } from './database/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHello() {
    try {
      await this.prisma.db.$connect();
      return {
        message: 'Fashion Friday API is running',
        database: 'Connected',
      };
    } catch (error) {
      return {
        message: 'Fashion Friday API is running',
        database: 'Disconnected',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  @Get('health')
  async health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
