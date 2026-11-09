import { Prisma } from '@ff/database';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class QualitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string) {
    if (category?.trim()) {
      const cat = category.trim();
      return this.prisma.db.quality.findMany({
        where: {
          categories: {
            hasSome: [
              cat,
              cat.toLowerCase(),
              cat.toUpperCase(),
              cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase(),
            ],
          },
        },
        orderBy: [{ position: 'asc' }, { name: 'asc' }],
      });
    }

    return this.prisma.db.quality.findMany({
      orderBy: [{ position: 'asc' }, { name: 'asc' }],
    });
  }

  async findById(id: string) {
    return this.prisma.db.quality.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return this.prisma.db.quality.findFirst({
      where: { name: { equals: name.trim(), mode: 'insensitive' } },
    });
  }

  async create(data: Prisma.QualityCreateInput) {
    return this.prisma.db.quality.create({
      data,
    });
  }

  async update(id: string, data: Prisma.QualityUpdateInput) {
    return this.prisma.db.quality.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.db.quality.delete({
      where: { id },
    });
  }

  async reorder(items: { id: string; position: number }[]) {
    const updates = items.map((item) =>
      this.prisma.db.quality.update({
        where: { id: item.id },
        data: { position: item.position },
      }),
    );
    return this.prisma.db.$transaction(updates);
  }
}
