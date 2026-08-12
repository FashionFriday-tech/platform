import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { ColorsService } from './colors.service';
import { CreateColorDto, UpdateColorDto } from './dto';

@Controller('admin/colors')
export class AdminColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Get()
  findAll() {
    return this.colorsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.colorsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateColorDto) {
    return this.colorsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateColorDto) {
    return this.colorsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.colorsService.delete(id);
  }
}

@Controller('colors')
export class PublicColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Get()
  findAll() {
    return this.colorsService.findAll();
  }
}
