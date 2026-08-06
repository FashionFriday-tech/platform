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

  async findActive() {
    return this.prisma.db.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.db.brand.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.db.brand.findUnique({
      where: { slug },
    });
  }

  async findActiveBySlug(slug: string) {
    const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
    const withoutHyphens = cleanSlug.replace(/-/g, '');
    return this.prisma.db.brand.findFirst({
      where: {
        OR: [
          { slug: { equals: cleanSlug, mode: 'insensitive' } },
          { name: { equals: cleanSlug, mode: 'insensitive' } },
          { slug: { equals: withoutHyphens, mode: 'insensitive' } },
        ],
        isActive: true,
      },
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
