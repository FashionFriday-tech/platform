import { generateBrandId, Prisma } from '@ff/database';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput) {
    return this.prisma.db.product.create({
      data: {
        id: data.id || generateBrandId('PROD'),
        ...data,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;

    return this.prisma.db.$transaction([
      this.prisma.db.product.count({ where }),
      this.prisma.db.product.findMany({
        skip,
        take,
        where,
        orderBy,
        include: { category: true, seller: true },
      }),
    ]);
  }

  async findPublicProducts(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;

    return this.prisma.db.$transaction([
      this.prisma.db.product.count({ where }),
      this.prisma.db.product.findMany({
        skip,
        take,
        where,
        orderBy,
        include: { category: true },
      }),
    ]);
  }

  async findDistinctBrandsAndCategories() {
    const [brands, categories] = await Promise.all([
      this.prisma.db.brand.findMany({
        select: { name: true, slug: true },
      }),
      this.prisma.db.category.findMany({
        select: { name: true, slug: true },
      }),
    ]);
    return { brands, categories };
  }

  async findQuickSuggestions(query: string, matchedBrandNames: string[] = []) {
    const clean = query.trim();
    return this.prisma.db.product.findMany({
      take: 4,
      where: {
        status: 'PUBLISHED',
        OR: [
          { name: { contains: clean, mode: 'insensitive' } },
          ...(matchedBrandNames.length > 0 ? [{ brand: { hasSome: matchedBrandNames } }] : []),
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        mainImage: true,
        sellingPrice: true,
        brand: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.db.product.findUnique({
      where: { id },
      include: { category: true, seller: true },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.db.product.findUnique({
      where: { slug },
      include: { category: true, seller: true },
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.db.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.db.product.delete({
      where: { id },
    });
  }
}
