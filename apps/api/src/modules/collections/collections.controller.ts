import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CollectionsService } from './collections.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';

@Controller('admin/collections')
export class AdminCollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  findAll() {
    return this.collectionsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateCollectionDto) {
    return this.collectionsService.create(dto);
  }

  @Patch('reorder')
  reorder(@Body() body: { items: { id: string; position: number }[] }) {
    return this.collectionsService.reorder(body.items);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.collectionsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.collectionsService.delete(id);
  }

  @Post(':id/products')
  addProducts(@Param('id') id: string, @Body() body: { productIds: string[] }) {
    return this.collectionsService.addProducts(id, body.productIds);
  }

  @Delete(':id/products/:productId')
  removeProduct(@Param('id') id: string, @Param('productId') productId: string) {
    return this.collectionsService.removeProduct(id, productId);
  }
}

@Controller('collections')
export class PublicCollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  findAll() {
    return this.collectionsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.collectionsService.findBySlug(slug);
  }
}
