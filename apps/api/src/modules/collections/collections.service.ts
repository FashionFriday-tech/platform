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
        const productCount = await this.prisma.db.product.count({
          where: { collections: { has: collection.slug } },
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
    return collection;
  }

  async create(data: CreateCollectionDto) {
    const result = await this.repository.create(data);
    triggerRevalidation('home-collections');
    return result;
  }

  async update(id: string, data: UpdateCollectionDto) {
    const collection = await this.repository.findById(id);
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    const result = await this.repository.update(id, data);
    triggerRevalidation('home-collections');
    return result;
  }

  async delete(id: string) {
    const collection = await this.repository.findById(id);
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    const result = await this.repository.delete(id);
    triggerRevalidation('home-collections');
    return result;
  }
}
