import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicProductsService } from '../services/public-products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: PublicProductsService) {}

  @Get()
  async getPublicProducts(@Query('skip') skip?: number, @Query('take') take?: number) {
    return this.productsService.getPublicProducts(Number(skip) || 0, Number(take) || 10);
  }

  @Get('search')
  async searchProducts(
    @Query('q') q: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.productsService.getProductsBySearch(q, Number(skip) || 0, Number(take) || 10);
  }

  @Get('featured')
  async getFeaturedProducts(@Query('skip') skip?: number, @Query('take') take?: number) {
    return this.productsService.getFeaturedProducts(Number(skip) || 0, Number(take) || 10);
  }

  @Get('trending')
  async getTrendingProducts(@Query('skip') skip?: number, @Query('take') take?: number) {
    return this.productsService.getTrendingProducts(Number(skip) || 0, Number(take) || 10);
  }

  @Get('category/:slug')
  async getProductsByCategory(
    @Param('slug') slug: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.productsService.getProductsByCategory(slug, Number(skip) || 0, Number(take) || 10);
  }

  @Get(':slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return this.productsService.getProductBySlug(slug);
  }
}
