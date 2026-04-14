import { prisma } from '@ff/database';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit {
  public readonly db = prisma;

  async onModuleInit() {
    console.log('Connecting to database...');
    try {
      await this.db.$connect();
      console.log('Successfully connected to database');
    } catch (error) {
      console.error('Failed to connect to database:', error);
    }
  }
}
