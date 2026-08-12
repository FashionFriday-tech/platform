import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { ColorsRepository } from './colors.repository';
import { CreateColorDto, UpdateColorDto } from './dto';

@Injectable()
export class ColorsService {
  constructor(private readonly repository: ColorsRepository) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: string) {
    const color = await this.repository.findById(id);
    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }
    return color;
  }

  async create(dto: CreateColorDto) {
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(`Color with name "${dto.name}" already exists`);
    }

    return this.repository.create({
      name: dto.name.trim(),
      hex: dto.hex.trim().toUpperCase(),
    });
  }

  async update(id: string, dto: UpdateColorDto) {
    await this.findById(id);

    if (dto.name) {
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(`Color with name "${dto.name}" already exists`);
      }
    }

    return this.repository.update(id, {
      name: dto.name ? dto.name.trim() : undefined,
      hex: dto.hex ? dto.hex.trim().toUpperCase() : undefined,
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.repository.delete(id);
  }
}
