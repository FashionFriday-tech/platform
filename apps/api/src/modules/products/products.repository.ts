import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@ff/database';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput) {
    return this.prisma.db.product.create({
      data,
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
        include: { category: true },
      })
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
        select: {
          id: true,
          name: true,
          slug: true,
          mainImage: true,
          sellingPrice: true,
          ogPrice: true,
          quality: true,
          averageRating: true,
          isFeatured: true,
          category: true,
        }
      })
    ]);
  }

  async findById(id: string) {
    return this.prisma.db.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.db.product.findFirst({
      where: { slug },
      include: { category: true },
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
