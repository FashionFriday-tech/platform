import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SearchLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async logSearch(query: string, userId?: string) {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return null;

    return this.prisma.db.searchLog.create({
      data: {
        query: trimmed,
        ...(userId ? { userId } : {}),
      },
    });
  }

  async getAllSearchLogs() {
    return this.prisma.db.searchLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });
  }
}
