import { Prisma } from '@ff/database';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CategoryCreateInput) {
    return this.prisma.db.category.create({ data });
  }

  async findAll() {
    return this.prisma.db.category.findMany({
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.db.category.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput) {
    return this.prisma.db.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.db.category.delete({
      where: { id },
    });
  }

  async reorder(items: { id: string; position: number }[]) {
    const updates = items.map((item) =>
      this.prisma.db.category.update({
        where: { id: item.id },
        data: { position: item.position },
      }),
    );
    return this.prisma.db.$transaction(updates);
  }
}
