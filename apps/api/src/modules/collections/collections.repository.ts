import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';

@Injectable()
export class CollectionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.db.collection.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.db.collection.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    const decoded = decodeURIComponent(slug).trim();
    return this.prisma.db.collection.findFirst({
      where: {
        OR: [
          { slug: { equals: decoded, mode: 'insensitive' } },
          { name: { equals: decoded.replace(/-/g, ' '), mode: 'insensitive' } },
        ],
      },
    });
  }

  async create(data: CreateCollectionDto) {
    return this.prisma.db.collection.create({
      data,
    });
  }

  async update(id: string, data: UpdateCollectionDto) {
    return this.prisma.db.collection.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.db.collection.delete({
      where: { id },
    });
  }
}
