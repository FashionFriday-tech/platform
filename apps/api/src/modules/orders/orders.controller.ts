import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

interface AuthRequest extends Request {
  user: {
    id?: string;
    sub?: string;
  };
}

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Req() req: AuthRequest, @Body() dto: CreateOrderDto) {
    const userId = req.user.id || req.user.sub;
    this.logger.log(
      `[OrdersController] Incoming POST /orders for user: ${String(userId)}, payload: ${JSON.stringify(dto)}`,
    );

    if (!userId) {
      this.logger.warn('[OrdersController] Unauthorized order creation attempt');
      throw new UnauthorizedException('Authentication required to place order');
    }

    try {
      const order = await this.ordersService.createOrder(userId, dto);
      this.logger.log(
        `[OrdersController] Order placed successfully: ${order.orderNumber} (ID: ${order.id})`,
      );
      return order;
    } catch (err: any) {
      this.logger.error(
        `[OrdersController] Error creating order for user ${userId}: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Req() req: AuthRequest) {
    const userId = req.user.id || req.user.sub;
    this.logger.log(`[OrdersController] Incoming GET /orders/me for user: ${String(userId)}`);
    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }
    return this.ordersService.findUserOrders(userId);
  }

  @Get('stats')
  async getOrderStats() {
    this.logger.log('[OrdersController] Incoming GET /orders/stats');
    return this.ordersService.getOrderStats();
  }

  @Get('admin')
  async getAllOrders() {
    this.logger.log('[OrdersController] Incoming GET /orders/admin');
    return this.ordersService.findAll();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') id: string) {
    // Note: Should restrict to the owner or admin in a real app
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  async updateOrder(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    this.logger.log(
      `[OrdersController] Incoming PATCH /orders/${id} with body: ${JSON.stringify(dto)}`,
    );
    return this.ordersService.updateOrder(id, dto);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
