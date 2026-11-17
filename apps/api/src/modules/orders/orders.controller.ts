import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { OrdersService } from './orders.service';

interface AuthRequest extends Request {
  user: {
    id?: string;
    sub?: string;
    role?: string;
  };
  rawBody?: Buffer;
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
      const result = await this.ordersService.createOrder(userId, dto);
      this.logger.log(
        `[OrdersController] Order processed successfully: ${result.order?.orderNumber} (Type: ${result.type})`,
      );
      return result;
    } catch (err: any) {
      this.logger.error(
        `[OrdersController] Error creating order for user ${userId}: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  async createOrderAlias(@Req() req: AuthRequest, @Body() dto: CreateOrderDto) {
    return this.createOrder(req, dto);
  }

  @Post('verify-payment')
  @UseGuards(JwtAuthGuard)
  async verifyPayment(@Req() req: AuthRequest, @Body() dto: VerifyPaymentDto) {
    const userId = req.user.id || req.user.sub;
    this.logger.log(
      `[OrdersController] Incoming POST /orders/verify-payment for user: ${String(userId)}, order: ${String(dto.orderId)}`,
    );

    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    return this.ordersService.verifyPayment(userId, dto);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('x-razorpay-signature') signature: string,
    @Headers('x-razorpay-event-id') eventId: string,
    @Body() body: any,
    @Req() req: AuthRequest,
  ) {
    this.logger.log(
      `[OrdersController] Incoming Razorpay webhook call (Event: ${body?.event}, Event ID: ${eventId || 'N/A'})`,
    );
    return this.ordersService.handleWebhook(body, signature, req.rawBody, eventId);
  }

  @Post(':id/confirm-stock')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async confirmStock(@Param('id') id: string) {
    this.logger.log(
      `[OrdersController] Incoming POST /orders/${id}/confirm-stock (Admin authorized)`,
    );
    return this.ordersService.confirmStockAndCapture(id);
  }

  @Post(':id/reject-stock')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async rejectStock(@Param('id') id: string, @Body() body?: { reason?: string }) {
    this.logger.log(
      `[OrdersController] Incoming POST /orders/${id}/reject-stock (Admin authorized)`,
    );
    return this.ordersService.rejectStockAndVoid(id, body?.reason);
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async refundOrder(@Param('id') id: string, @Body() body?: { amount?: number; reason?: string }) {
    this.logger.log(`[OrdersController] Incoming POST /orders/${id}/refund (Admin authorized)`);
    return this.ordersService.refundCapturedOrder(id, body?.amount, body?.reason);
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
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getOrderStats() {
    this.logger.log('[OrdersController] Incoming GET /orders/stats');
    return this.ordersService.getOrderStats();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllOrders() {
    this.logger.log('[OrdersController] Incoming GET /orders/admin');
    return this.ordersService.findAll();
  }

  @Get('reconciliation')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getReconciliationReport() {
    this.logger.log('[OrdersController] Incoming GET /orders/reconciliation (Admin authorized)');
    return this.ordersService.getReconciliationReport();
  }

  @Get(':id/refund-timeline')
  @UseGuards(JwtAuthGuard)
  async getRefundTimeline(@Param('id') id: string, @Req() req: AuthRequest) {
    const userId = req.user.id || req.user.sub;
    const role = req.user.role;
    const isAdmin = role === 'SUPER_ADMIN' || role === 'STAFF_ADMIN';
    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }
    return this.ordersService.getRefundTimeline(id, userId, isAdmin);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') id: string, @Req() req: AuthRequest) {
    const userId = req.user.id || req.user.sub;
    const role = req.user.role;
    const order = await this.ordersService.findOne(id);

    const isAdmin = role === 'SUPER_ADMIN' || role === 'STAFF_ADMIN';
    if (!isAdmin && order.userId !== userId) {
      this.logger.warn(
        `[OrdersController] IDOR attempt: User ${String(userId)} tried to access order ${order.id} owned by ${order.userId}`,
      );
      throw new ForbiddenException('You do not have permission to view this order');
    }

    return order;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateOrder(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    this.logger.log(
      `[OrdersController] Incoming PATCH /orders/${id} with body: ${JSON.stringify(dto)}`,
    );
    return this.ordersService.updateOrder(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteOrder(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
