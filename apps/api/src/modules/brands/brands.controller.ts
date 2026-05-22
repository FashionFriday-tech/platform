import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { BrandsService } from './brands.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';

@Controller('admin/brands')
export class AdminBrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateBrandDto) {
    return this.brandsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.brandsService.delete(id);
  }
}

@Controller('brands')
export class PublicBrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.brandsService.findBySlug(slug);
  }
}
