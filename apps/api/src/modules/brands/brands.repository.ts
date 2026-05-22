import { Prisma } from '@ff/database';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BrandsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.db.brand.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.db.brand.findUnique({
      where: { slug },
    });
  }

  async create(data: Prisma.BrandCreateInput) {
    return this.prisma.db.brand.create({ data });
  }

  async update(id: string, data: Prisma.BrandUpdateInput) {
    return this.prisma.db.brand.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.db.brand.delete({
      where: { id },
    });
  }
}
