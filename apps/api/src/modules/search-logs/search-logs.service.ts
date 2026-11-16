import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SearchLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async logSearch(
    query: string,
    userId?: string,
    resultsCount?: number,
    hasResults?: boolean,
  ) {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      return null;
    }

    if (resultsCount === undefined && hasResults === undefined) {
      // Dynamic verification against catalog if not provided by caller
      const count = await this.prisma.db.product.count({
        where: {
          status: 'PUBLISHED',
          OR: [
            { name: { contains: trimmed, mode: 'insensitive' } },
            { description: { contains: trimmed, mode: 'insensitive' } },
            { brand: { has: trimmed } },
            { category: { name: { contains: trimmed, mode: 'insensitive' } } },
          ],
        },
      });
      resultsCount = count;
      hasResults = count > 0;
    } else if (hasResults === undefined && resultsCount !== undefined) {
      hasResults = resultsCount > 0;
    } else if (hasResults !== undefined && resultsCount === undefined) {
      resultsCount = hasResults ? 1 : 0;
    }

    // Do not store duplicate search logs if the same input was already searched by this user/guest
    const existingLog = await this.prisma.db.searchLog.findFirst({
      where: {
        query: {
          equals: trimmed,
          mode: 'insensitive',
        },
        ...(userId ? { userId } : { userId: null }),
      },
    });

    if (existingLog) {
      return this.prisma.db.searchLog.update({
        where: { id: existingLog.id },
        data: {
          createdAt: new Date(),
          hasResults: hasResults ?? existingLog.hasResults,
          resultsCount: resultsCount ?? existingLog.resultsCount,
        },
      });
    }

    return this.prisma.db.searchLog.create({
      data: {
        query: trimmed,
        ...(userId ? { userId } : {}),
        hasResults: hasResults ?? true,
        resultsCount: resultsCount ?? 0,
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
