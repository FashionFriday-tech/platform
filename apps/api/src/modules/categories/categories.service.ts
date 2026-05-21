import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Prisma, Gender } from '@ff/database';

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
    return this.categoriesRepository.create(data);
  }

  async findAll() {
    return this.categoriesRepository.findAll();
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const data: Prisma.CategoryUpdateInput = {};
    if (dto.name) data.name = dto.name;
    if (dto.slug) data.slug = dto.slug;
    if (dto.image) data.image = dto.image;
    if (dto.gender) data.gender = dto.gender.toUpperCase() as Gender;

    return this.categoriesRepository.update(id, data);
  }

  async remove(id: string) {
    return this.categoriesRepository.delete(id);
  }
}
