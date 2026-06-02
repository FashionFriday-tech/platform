import { Gender, Prisma } from '@ff/database';
import { Injectable, NotFoundException } from '@nestjs/common';

import { triggerRevalidation } from '../revalidate-helper';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(dto: CreateCategoryDto) {
    const data: Prisma.CategoryCreateInput = {
      name: dto.name,
      slug: dto.slug,
      image: dto.image,
      gender: dto.gender.toUpperCase() as Gender,
    };
    const result = await this.categoriesRepository.create(data);
    this.triggerCategoriesRevalidation();
    return result;
  }

  async findAll() {
    return this.categoriesRepository.findAll();
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const data: Prisma.CategoryUpdateInput = {};
    if (dto.name) {
      data.name = dto.name;
    }
    if (dto.slug) {
      data.slug = dto.slug;
    }
    if (dto.image) {
      data.image = dto.image;
    }
    if (dto.gender) {
      data.gender = dto.gender.toUpperCase() as Gender;
    }

    const result = await this.categoriesRepository.update(id, data);
    this.triggerCategoriesRevalidation();
    return result;
  }
  async remove(id: string) {
    const result = await this.categoriesRepository.delete(id);
    this.triggerCategoriesRevalidation();
    return result;
  }

  async reorder(items: { id: string; position: number }[]) {
    const result = await this.categoriesRepository.reorder(items);
    this.triggerCategoriesRevalidation();
    return result;
  }

  private triggerCategoriesRevalidation() {
    void triggerRevalidation('home-categories');
    void triggerRevalidation('home-categories', '/men');
    void triggerRevalidation('home-categories', '/women');
  }
}
