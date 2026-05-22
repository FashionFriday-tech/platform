import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
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
      })
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
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateCollectionDto) {
    const collection = await this.repository.findById(id);
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    const collection = await this.repository.findById(id);
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    return this.repository.delete(id);
  }
}
