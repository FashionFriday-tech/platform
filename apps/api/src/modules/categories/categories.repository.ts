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
    const [categories, products] = await this.prisma.db.$transaction([
      this.prisma.db.category.findMany({
        orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      this.prisma.db.product.findMany({
        select: {
          id: true,
          gender: true,
          categoryId: true,
          category: {
            select: { id: true, name: true, gender: true },
          },
        },
      }),
    ]);

    return categories.map((cat) => {
      const catName = cat.name.toLowerCase();
      const catGender = cat.gender;
      const matchingCount = products.filter((p) => {
        const pCatName = p.category?.name?.toLowerCase();
        const matchesCategory = p.categoryId === cat.id || pCatName === catName;
        if (!matchesCategory) {
          return false;
        }
        const pGender = p.gender;
        if (pGender === 'UNISEX') {
          return true;
        }
        return pGender === catGender;
      }).length;

      return {
        ...cat,
        productCount: matchingCount,
        _count: {
          products: matchingCount,
        },
      };
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
    return this.prisma.db.$transaction(async (tx) => {
      // 1. Disassociate products from this category (keep products intact in catalog)
      await tx.product.updateMany({
        where: { categoryId: id },
        data: { categoryId: null },
      });

      // 2. Disconnect sellers associated with this category
      await tx.category.update({
        where: { id },
        data: {
          sellers: {
            set: [],
          },
        },
      });

      // 3. Delete the category
      return tx.category.delete({
        where: { id },
      });
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
