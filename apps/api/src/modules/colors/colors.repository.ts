import { Prisma } from '@ff/database';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ColorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.db.color.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.db.color.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return this.prisma.db.color.findFirst({
      where: { name: { equals: name.trim(), mode: 'insensitive' } },
    });
  }

  async create(data: Prisma.ColorCreateInput) {
    return this.prisma.db.color.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ColorUpdateInput) {
    return this.prisma.db.color.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.db.color.delete({
      where: { id },
    });
  }
}
