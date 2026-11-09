import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { triggerRevalidation } from '../revalidate-helper';
import { CollectionsRepository } from './collections.repository';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly repository: CollectionsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    const collections = await this.repository.findAll();

    // Attach product counts dynamically
    const enrichedCollections = await Promise.all(
      collections.map(async (collection: any) => {
        const variants = [
          collection.slug,
          collection.name,
          collection.slug?.toLowerCase(),
          collection.slug?.toUpperCase(),
          collection.name?.toLowerCase(),
          collection.name?.toUpperCase(),
          collection.slug?.replace(/-/g, ' '),
          collection.slug?.replace(/-/g, ' ').toUpperCase(),
        ].filter(Boolean);
        const productCount = await this.prisma.db.product.count({
          where: {
            collections: { hasSome: Array.from(new Set(variants)) },
          },
        });
        return { ...collection, productCount };
      }),
    );

    return enrichedCollections;
  }

  async findBySlug(slug: string) {
    const collection = await this.repository.findBySlug(slug);
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    const variants = [
      collection.slug,
      collection.name,
      collection.slug?.toLowerCase(),
      collection.slug?.toUpperCase(),
      collection.name?.toLowerCase(),
      collection.name?.toUpperCase(),
      collection.slug?.replace(/-/g, ' '),
      collection.slug?.replace(/-/g, ' ').toUpperCase(),
    ].filter(Boolean);
    const productCount = await this.prisma.db.product.count({
      where: {
        collections: { hasSome: Array.from(new Set(variants)) },
      },
    });
    return { ...collection, productCount };
  }

  async addProducts(collectionIdOrSlug: string, productIds: string[]) {
    const collection =
      (await this.repository.findById(collectionIdOrSlug)) ??
      (await this.repository.findBySlug(collectionIdOrSlug));
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    const colSlug = collection.slug.toLowerCase().trim();
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return { success: true, count: 0 };
    }

    const products = await this.prisma.db.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, collections: true, slug: true },
    });

    for (const product of products) {
      const existing = (product.collections || []).map((c: string) => c.trim().toLowerCase());
      if (!existing.includes(colSlug)) {
        const updated = Array.from(new Set([...existing, colSlug]));
        await this.prisma.db.product.update({
          where: { id: product.id },
          data: { collections: updated },
        });
        if (product.slug) {
          void triggerRevalidation(`product-${product.slug}`, `/product/${product.slug}`);
        }
      }
    }

    void triggerRevalidation(`collection-products-${colSlug}`, `/collections/${colSlug}`);
    void triggerRevalidation('home-collections');
    void triggerRevalidation('collections');

    return { success: true, count: products.length };
  }

  async removeProduct(collectionIdOrSlug: string, productId: string) {
    const collection =
      (await this.repository.findById(collectionIdOrSlug)) ??
      (await this.repository.findBySlug(collectionIdOrSlug));
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    const colSlug = collection.slug.toLowerCase().trim();
    const colName = collection.name.toLowerCase().trim();
    const clean = (s: string) => s?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    const colClean = clean(colSlug);

    const product = await this.prisma.db.product.findUnique({
      where: { id: productId },
      select: { id: true, collections: true, slug: true },
    });

    if (product) {
      const existing = product.collections || [];
      const updated = existing.filter((c: string) => {
        if (!c || typeof c !== 'string') {
          return false;
        }
        const lower = c.toLowerCase().trim();
        return (
          lower !== colSlug &&
          lower !== colName &&
          clean(lower) !== colClean &&
          lower.replace(/[\s-]+/g, '-') !== colSlug
        );
      });

      await this.prisma.db.product.update({
        where: { id: product.id },
        data: { collections: updated },
      });

      if (product.slug) {
        void triggerRevalidation(`product-${product.slug}`, `/product/${product.slug}`);
      }
      void triggerRevalidation(`collection-products-${colSlug}`, `/collections/${colSlug}`);
      void triggerRevalidation('home-collections');
      void triggerRevalidation('collections');
    }

    return { success: true };
  }

  async create(data: CreateCollectionDto) {
    const result = await this.repository.create(data);
    void triggerRevalidation('home-collections');
    return result;
  }

  async update(id: string, data: UpdateCollectionDto) {
    const collection = await this.repository.findById(id);
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    const result = await this.repository.update(id, data);
    void triggerRevalidation('home-collections');
    return result;
  }

  async delete(id: string) {
    const collection = await this.repository.findById(id);
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    const result = await this.repository.delete(id);
    void triggerRevalidation('home-collections');
    return result;
  }
}
