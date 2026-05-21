import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@ff/database';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CategoryCreateInput) {
    return this.prisma.db.category.create({ data });
  }

  async findAll() {
    return this.prisma.db.category.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
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
}
