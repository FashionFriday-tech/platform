import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { SyncCartDto } from './dto/sync-cart.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';

interface RequestWithUser {
  user: {
    id?: string;
    sub?: string;
    phone?: string;
    role?: string;
  };
}

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private getUserId(req: RequestWithUser): string {
    const id = req.user?.id || req.user?.sub;
    if (!id) {
      throw new UnauthorizedException('Authentication required');
    }
    return id;
  }

  @Get()
  async getUserCart(@Request() req: RequestWithUser) {
    return this.cartService.getUserCart(this.getUserId(req));
  }

  @Post('items')
  async addToCart(@Request() req: RequestWithUser, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(this.getUserId(req), dto);
  }

  @Patch('items/:id')
  async updateQuantity(
    @Request() req: RequestWithUser,
    @Param('id') itemId: string,
    @Body() dto: UpdateCartQuantityDto,
  ) {
    return this.cartService.updateQuantity(this.getUserId(req), itemId, dto);
  }

  @Delete('items/:id')
  async removeItem(@Request() req: RequestWithUser, @Param('id') itemId: string) {
    return this.cartService.removeItem(this.getUserId(req), itemId);
  }

  @Delete()
  async clearCart(@Request() req: RequestWithUser) {
    return this.cartService.clearCart(this.getUserId(req));
  }

  @Post('sync')
  async syncGuestCart(@Request() req: RequestWithUser, @Body() dto: SyncCartDto) {
    return this.cartService.syncGuestCart(this.getUserId(req), dto);
  }
}
