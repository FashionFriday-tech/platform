import { MAJOR_COLORS } from '@ff/schemas';
import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';

import { ColorsRepository } from './colors.repository';
import { CreateColorDto, UpdateColorDto } from './dto';

@Injectable()
export class ColorsService implements OnModuleInit {
  constructor(private readonly repository: ColorsRepository) {}

  async onModuleInit() {
    await this.seedDefaultColorsIfEmpty();
  }

  async seedDefaultColorsIfEmpty() {
    try {
      const allColors = await this.repository.findAll();
      const count = allColors.length;
      if (count === 0) {
        for (const c of MAJOR_COLORS) {
          await this.repository.create({
            name: c.name,
            hex: c.hex.toUpperCase(),
          });
        }
      }
    } catch (err) {
      console.error('Failed to auto-seed colors on startup:', err);
    }
  }

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
