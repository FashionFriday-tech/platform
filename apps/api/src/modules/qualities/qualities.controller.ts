import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { CreateQualityDto, UpdateQualityDto } from './dto';
import { QualitiesService } from './qualities.service';

@Controller('admin/qualities')
export class AdminQualitiesController {
  constructor(private readonly qualitiesService: QualitiesService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.qualitiesService.findAll(category);
  }

  @Patch('reorder')
  reorder(@Body() body: { items: { id: string; position: number }[] }) {
    return this.qualitiesService.reorder(body.items);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.qualitiesService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateQualityDto) {
    return this.qualitiesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQualityDto) {
    return this.qualitiesService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.qualitiesService.delete(id);
  }
}

@Controller('qualities')
export class PublicQualitiesController {
  constructor(private readonly qualitiesService: QualitiesService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.qualitiesService.findAll(category);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.qualitiesService.findById(id);
  }
}
