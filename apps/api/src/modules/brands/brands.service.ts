import { Injectable, NotFoundException } from '@nestjs/common';

import { triggerRevalidation } from '../revalidate-helper';
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
    const result = await this.repository.create({
      ...dto,
      logo: dto.logo || '',
    });
    this.triggerBrandsRevalidation();
    return result;
  }

  async update(id: string, dto: UpdateBrandDto) {
    const result = await this.repository.update(id, dto);
    this.triggerBrandsRevalidation();
    return result;
  }

  async delete(id: string) {
    const result = await this.repository.delete(id);
    this.triggerBrandsRevalidation();
    return result;
  }

  private triggerBrandsRevalidation() {
    triggerRevalidation('brands');
    triggerRevalidation('brands', '/brands');
  }
}
