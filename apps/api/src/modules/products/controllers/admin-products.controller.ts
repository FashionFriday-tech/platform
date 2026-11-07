import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { AdminProductsService } from '../services/admin-products.service';

@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: AdminProductsService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  async getProducts(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.productsService.getProducts(
      Number(skip) || 0,
      Number(take) || 100,
      search,
      categoryId,
    );
  }

  @Get(':id/interactions/summary')
  async getProductInteractionsSummary(@Param('id') id: string) {
    return this.productsService.getProductInteractionsSummary(id);
  }

  @Get(':id/interactions')
  async getProductInteractionsList(
    @Param('id') id: string,
    @Query('type') type: 'wishlist' | 'cart' | 'notifications' | 'clicks',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.getProductInteractionsList(
      id,
      type || 'wishlist',
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
    );
  }

  @Get(':id/performance')
  async getProductPerformance(@Param('id') id: string) {
    return this.productsService.getProductPerformance(id);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const product = await this.productsService.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
