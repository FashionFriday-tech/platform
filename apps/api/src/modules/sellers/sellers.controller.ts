import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { CreateSellerDto, SellerQueryDto, UpdateSellerDto } from './dto';
import { SellersService } from './sellers.service';

@Controller('admin/sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get()
  findAll(@Query() query: SellerQueryDto) {
    return this.sellersService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.sellersService.getStats();
  }

  @Get('by-category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.sellersService.findByCategory(categoryId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.sellersService.findById(id);
  }

  @Get(':id/orders')
  getSellerOrders(@Param('id') id: string) {
    return this.sellersService.getSellerOrders(id);
  }

  @Get(':id/products')
  getSellerProducts(@Param('id') id: string) {
    return this.sellersService.getSellerProducts(id);
  }

  @Post()
  create(@Body() dto: CreateSellerDto) {
    return this.sellersService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSellerDto) {
    return this.sellersService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.sellersService.delete(id);
  }
}
