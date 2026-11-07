import { Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';

import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt.guard';
import { PublicProductsService } from '../services/public-products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: PublicProductsService) {}

  @Get()
  async getPublicProducts(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('brand') brand?: string,
    @Query('collection') collection?: string,
  ) {
    return this.productsService.getPublicProducts(
      Number(skip) || 0,
      Number(take) || 10,
      brand,
      collection,
    );
  }

  @Get('search/suggestions')
  async getSearchSuggestions(@Query('q') q?: string) {
    return this.productsService.getSearchSuggestions(q);
  }

  @Get('search')
  async searchProducts(
    @Query('q') q: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.productsService.getProductsBySearch(q, Number(skip) || 0, Number(take) || 50);
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
    @Query('gender') gender?: string,
  ) {
    return this.productsService.getProductsByCategory(
      slug,
      Number(skip) || 0,
      Number(take) || 10,
      gender,
    );
  }

  @Post(':id/track-click')
  @UseGuards(OptionalJwtAuthGuard)
  async trackProductClick(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id ?? req.user?.sub;
    if (!userId) {
      return { tracked: false };
    }
    return this.productsService.trackProductClick(id, userId);
  }

  @Post(':id/notify-me')
  @UseGuards(OptionalJwtAuthGuard)
  async subscribeRestockNotification(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id ?? req.user?.sub;
    if (!userId) {
      return { success: false, requireAuth: true };
    }
    return this.productsService.subscribeRestockNotification(id, userId);
  }

  @Get(':id/notify-me/status')
  @UseGuards(OptionalJwtAuthGuard)
  async getRestockNotificationStatus(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id ?? req.user?.sub;
    if (!userId) {
      return { isNotified: false };
    }
    return this.productsService.getRestockNotificationStatus(id, userId);
  }

  @Get(':slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return this.productsService.getProductBySlug(slug);
  }
}
