import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { SyncCartDto } from './dto/sync-cart.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';

interface RequestWithUser {
  user: {
    userId: string;
    phone: string;
    role: string;
  };
}

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getUserCart(@Request() req: RequestWithUser) {
    return this.cartService.getUserCart(req.user.userId);
  }

  @Post('items')
  async addToCart(@Request() req: RequestWithUser, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.userId, dto);
  }

  @Patch('items/:id')
  async updateQuantity(
    @Request() req: RequestWithUser,
    @Param('id') itemId: string,
    @Body() dto: UpdateCartQuantityDto,
  ) {
    return this.cartService.updateQuantity(req.user.userId, itemId, dto);
  }

  @Delete('items/:id')
  async removeItem(@Request() req: RequestWithUser, @Param('id') itemId: string) {
    return this.cartService.removeItem(req.user.userId, itemId);
  }

  @Delete()
  async clearCart(@Request() req: RequestWithUser) {
    return this.cartService.clearCart(req.user.userId);
  }

  @Post('sync')
  async syncGuestCart(@Request() req: RequestWithUser, @Body() dto: SyncCartDto) {
    return this.cartService.syncGuestCart(req.user.userId, dto);
  }
}
