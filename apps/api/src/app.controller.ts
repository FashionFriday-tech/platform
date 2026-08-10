import { Body, Controller, Get, Post } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { PrismaService } from './database/prisma.service';

const MAINTENANCE_FILE = path.join(process.cwd(), 'maintenance-state.json');

interface MaintenanceState {
  isUnderMaintenance: boolean;
  message: string;
  updatedAt: string;
}

let inMemoryState: MaintenanceState = {
  isUnderMaintenance: false,
  message:
    "We're currently upgrading the Fashion Friday platform for our next drop. We'll be back shortly.",
  updatedAt: new Date().toISOString(),
};

function readMaintenanceState(): MaintenanceState {
  try {
    if (fs.existsSync(MAINTENANCE_FILE)) {
      const data = fs.readFileSync(MAINTENANCE_FILE, 'utf-8');
      inMemoryState = JSON.parse(data);
    }
  } catch (error) {
    console.warn('[Maintenance] Failed to read state from file:', error);
  }
  return inMemoryState;
}

function writeMaintenanceState(state: MaintenanceState): void {
  inMemoryState = state;
  try {
    fs.writeFileSync(MAINTENANCE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (error) {
    console.warn('[Maintenance] Failed to persist state to file:', error);
  }
}

// Pre-load on startup
readMaintenanceState();

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHello() {
    return {
      message: 'Fashion Friday API is running',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('health/db')
  async healthDb() {
    try {
      await this.prisma.db.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'Connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'Disconnected',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('maintenance')
  getMaintenance() {
    return readMaintenanceState();
  }

  @Post('admin/maintenance')
  updateAdminMaintenance(@Body() body: { isUnderMaintenance: boolean; message?: string }) {
    const current = readMaintenanceState();
    const updated: MaintenanceState = {
      isUnderMaintenance: body.isUnderMaintenance,
      message: body.message || current.message,
      updatedAt: new Date().toISOString(),
    };
    writeMaintenanceState(updated);
    return updated;
  }

  @Post('maintenance')
  updateMaintenance(@Body() body: { isUnderMaintenance: boolean; message?: string }) {
    return this.updateAdminMaintenance(body);
  }
}
