import { prisma } from '@ff/database';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit {
  async onModuleInit() {
    await prisma.$connect();
  }
}
