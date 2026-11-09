import { Quality } from '@ff/database';
import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreateQualityDto, UpdateQualityDto } from './dto';
import { QualitiesRepository } from './qualities.repository';

const DEFAULT_QUALITIES = [
  {
    name: 'UA',
    description: 'Unauthorized Authentic - near-retail factory molds and materials',
    categories: ['Footwear', 'Sneakers'],
    position: 0,
  },
  {
    name: 'Semi UA',
    description: 'Retail silhouette with selective material substitutions',
    categories: ['Footwear', 'Sneakers'],
    position: 1,
  },
  {
    name: '10A',
    description: 'Top-tier master replica with high shape accuracy and finish',
    categories: ['Footwear', 'Watches', 'Clothing', 'Accessories'],
    position: 2,
  },
  {
    name: '7AA',
    description: 'Specialized high-accuracy automatic and chronograph watch grade',
    categories: ['Watches', 'Accessories'],
    position: 3,
  },
  {
    name: '7A',
    description: 'Mid-tier balanced quality for everyday wear and durability',
    categories: ['Footwear', 'Watches', 'Clothing', 'Accessories'],
    position: 4,
  },
  {
    name: '6A',
    description: 'Budget-conscious standard tier for casual daily wear',
    categories: ['Footwear', 'Sneakers'],
    position: 5,
  },
  {
    name: '5A',
    description: 'Entry-level budget tier with approximate silhouette',
    categories: ['Footwear', 'Watches'],
    position: 6,
  },
  {
    name: 'Original',
    description: 'Official brand retail distribution / verified authentic build',
    categories: ['Footwear', 'Watches', 'Clothing', 'Accessories'],
    position: 7,
  },
  {
    name: 'Premium',
    description: 'Enhanced materials and high-spec construction',
    categories: ['Watches', 'Clothing', 'Accessories'],
    position: 8,
  },
  {
    name: 'Standard',
    description: 'Regular market grade build',
    categories: ['Footwear', 'Watches', 'Clothing', 'Accessories'],
    position: 9,
  },
  {
    name: 'Surplus',
    description: 'Factory excess overproduction from export runs',
    categories: ['Footwear', 'Clothing'],
    position: 10,
  },
];

@Injectable()
export class QualitiesService implements OnModuleInit {
  constructor(
    private readonly repository: QualitiesRepository,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.seedDefaultQualitiesIfEmpty();
  }

  async seedDefaultQualitiesIfEmpty() {
    try {
      const existing = await this.repository.findAll();
      if (existing.length === 0) {
        for (const item of DEFAULT_QUALITIES) {
          await this.repository.create({
            name: item.name,
            description: item.description,
            categories: item.categories,
            position: item.position,
          });
        }
      }
    } catch (err) {
      console.error('Failed to auto-seed qualities on startup:', err);
    }
  }

  async findAll(category?: string) {
    const qualities = await this.repository.findAll(category);

    const enriched = await Promise.all(
      qualities.map(async (q: Quality) => {
        const productCount = await this.prisma.db.product.count({
          where: {
            quality: {
              equals: q.name,
              mode: 'insensitive',
            },
          },
        });
        return {
          ...q,
          productCount,
        };
      }),
    );

    return enriched;
  }

  async findById(id: string) {
    const quality = await this.repository.findById(id);
    if (!quality) {
      throw new NotFoundException(`Quality with ID ${id} not found`);
    }

    const productCount = await this.prisma.db.product.count({
      where: {
        quality: {
          equals: quality.name,
          mode: 'insensitive',
        },
      },
    });

    return {
      ...quality,
      productCount,
    };
  }

  async create(dto: CreateQualityDto) {
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(`Quality with name "${dto.name}" already exists`);
    }

    return this.repository.create({
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      categories: dto.categories ?? [],
      position: dto.position ?? 0,
    });
  }

  async update(id: string, dto: UpdateQualityDto) {
    await this.findById(id);

    if (dto.name) {
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(`Quality with name "${dto.name}" already exists`);
      }
    }

    return this.repository.update(id, {
      ...(dto.name !== undefined && { name: dto.name.trim() }),
      ...(dto.description !== undefined && { description: dto.description?.trim() || null }),
      ...(dto.categories !== undefined && { categories: dto.categories }),
      ...(dto.position !== undefined && { position: dto.position }),
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.repository.delete(id);
  }

  async reorder(items: { id: string; position: number }[]) {
    return this.repository.reorder(items);
  }
}
