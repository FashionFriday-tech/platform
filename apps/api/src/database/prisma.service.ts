import { prisma } from '@ff/database';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit {
  public readonly db = prisma;

  async onModuleInit() {
    await this.db.$connect();
  }
}
