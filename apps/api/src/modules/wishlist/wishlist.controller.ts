import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { SyncWishlistDto } from './dto/sync-wishlist.dto';
import { WishlistService } from './wishlist.service';

interface AuthRequest extends Request {
  user: {
    id?: string;
    sub?: string;
  };
}

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  private getUserId(req: AuthRequest): string {
    const id = req.user?.id || req.user?.sub;
    if (!id) {
      throw new UnauthorizedException('Authentication required');
    }
    return id;
  }

  /**
   * GET /wishlist
   * Get user's saved wishlist products
   */
  @Get()
  async getWishlist(@Req() req: AuthRequest) {
    const userId = this.getUserId(req);
    return this.wishlistService.getUserWishlist(userId);
  }

  /**
   * POST /wishlist/:productId/toggle
   * Toggle product in wishlist
   */
  @Post(':productId/toggle')
  @HttpCode(HttpStatus.OK)
  async toggleWishlist(@Req() req: AuthRequest, @Param('productId') productId: string) {
    const userId = this.getUserId(req);
    return this.wishlistService.toggleWishlist(userId, productId);
  }

  /**
   * DELETE /wishlist/:productId
   * Remove item from wishlist
   */
  @Delete(':productId')
  @HttpCode(HttpStatus.OK)
  async removeFromWishlist(@Req() req: AuthRequest, @Param('productId') productId: string) {
    const userId = this.getUserId(req);
    return this.wishlistService.removeFromWishlist(userId, productId);
  }

  /**
   * POST /wishlist/sync
   * Merge guest localStorage items into database
   */
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncWishlist(@Req() req: AuthRequest, @Body() dto: SyncWishlistDto) {
    const userId = this.getUserId(req);
    return this.wishlistService.syncGuestWishlist(userId, dto.productIds);
  }

  /**
   * GET /wishlist/check/:productId
   * Check if a single product is wishlisted
   */
  @Get('check/:productId')
  async checkIsWishlisted(@Req() req: AuthRequest, @Param('productId') productId: string) {
    const userId = this.getUserId(req);
    const isWishlisted = await this.wishlistService.checkIsWishlisted(userId, productId);
    return { isWishlisted, productId };
  }
}
