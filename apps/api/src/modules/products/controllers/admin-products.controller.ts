import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
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

  @Get('stats')
  async getProductStats() {
    return this.productsService.getProductStats();
  }

  @Get('model-groups')
  async getModelGroups(@Query('search') search?: string) {
    return this.productsService.getModelGroups(search);
  }

  @Get('model-groups/details')
  async getModelGroupsDetails(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.getModelGroupsDetails(
      search,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Get('model-groups/:group/products')
  async getModelGroupProducts(@Param('group') group: string) {
    return this.productsService.getModelGroupProducts(group);
  }

  @Put('model-groups/:group')
  async renameModelGroup(
    @Param('group') group: string,
    @Body('newGroup') newGroup: string,
  ) {
    return this.productsService.renameModelGroup(group, newGroup);
  }

  @Post('model-groups/:group/products')
  async addProductsToGroup(
    @Param('group') group: string,
    @Body('productIds') productIds: string[],
  ) {
    return this.productsService.addProductsToGroup(group, productIds);
  }

  @Delete('model-groups/products/:productId')
  async removeProductFromGroup(@Param('productId') productId: string) {
    return this.productsService.removeProductFromGroup(productId);
  }

  @Get()
  async getProducts(
    @Query('skip') skip?: string | number,
    @Query('take') take?: string | number,
    @Query('page') page?: string | number,
    @Query('limit') limit?: string | number,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('categories') categories?: string,
    @Query('status') status?: string,
    @Query('statuses') statuses?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('minPrice') minPrice?: string | number,
    @Query('maxPrice') maxPrice?: string | number,
    @Query('brand') brand?: string,
    @Query('brands') brands?: string,
    @Query('quality') quality?: string,
    @Query('qualities') qualities?: string,
  ) {
    const takeNum = Number(limit) || Number(take) || 20;
    const pageNum =
      Number(page) || (skip !== undefined ? Math.floor(Number(skip) / takeNum) + 1 : 1);
    const skipNum = skip !== undefined ? Number(skip) : (pageNum - 1) * takeNum;

    return this.productsService.getProducts(
      skipNum,
      takeNum,
      search,
      categoryId,
      status,
      sortBy,
      sortOrder,
      minPrice !== undefined && !isNaN(Number(minPrice)) ? Number(minPrice) : undefined,
      maxPrice !== undefined && !isNaN(Number(maxPrice)) ? Number(maxPrice) : undefined,
      categories,
      statuses,
      brand,
      brands,
      quality,
      qualities,
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
