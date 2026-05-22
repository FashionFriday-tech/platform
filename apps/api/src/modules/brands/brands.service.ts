import { Injectable, NotFoundException } from '@nestjs/common';

import { BrandsRepository } from './brands.repository';
import { CreateBrandDto, UpdateBrandDto } from './dto';

@Injectable()
export class BrandsService {
  constructor(private readonly repository: BrandsRepository) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findBySlug(slug: string) {
    const brand = await this.repository.findBySlug(slug);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  async create(dto: CreateBrandDto) {
    return this.repository.create({
      ...dto,
      logo: dto.logo || '',
    });
  }

  async update(id: string, dto: UpdateBrandDto) {
    return this.repository.update(id, dto);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
