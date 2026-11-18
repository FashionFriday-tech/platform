import { Body, Controller, Get, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';

import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PaymentQueryDto, RefundPaymentDto, VoidPaymentDto } from './dto/payment-query.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(JwtAuthGuard, AdminGuard)
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('admin')
  async getAllPayments(@Query() query: PaymentQueryDto) {
    this.logger.log(`[PaymentsController] GET /payments/admin query=${JSON.stringify(query)}`);
    return this.paymentsService.getAllPayments(query);
  }

  @Get('stats')
  async getPaymentStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    this.logger.log(
      `[PaymentsController] GET /payments/stats start=${startDate ?? 'all'} end=${endDate ?? 'all'}`,
    );
    return this.paymentsService.getPaymentStats(startDate, endDate);
  }

  @Get(':id')
  async getPaymentDetails(@Param('id') id: string) {
    this.logger.log(`[PaymentsController] GET /payments/${id}`);
    return this.paymentsService.getPaymentDetails(id);
  }

  @Post(':id/sync')
  async syncGateway(@Param('id') id: string) {
    this.logger.log(`[PaymentsController] POST /payments/${id}/sync`);
    return this.paymentsService.syncGateway(id);
  }

  @Post(':id/capture')
  async capturePayment(@Param('id') id: string) {
    this.logger.log(`[PaymentsController] POST /payments/${id}/capture`);
    return this.paymentsService.capturePayment(id);
  }

  @Post(':id/void')
  async voidPayment(@Param('id') id: string, @Body() body?: VoidPaymentDto) {
    this.logger.log(`[PaymentsController] POST /payments/${id}/void`);
    return this.paymentsService.voidPayment(id, body?.reason);
  }

  @Post(':id/refund')
  async refundPayment(@Param('id') id: string, @Body() body?: RefundPaymentDto) {
    this.logger.log(
      `[PaymentsController] POST /payments/${id}/refund amount=${body?.amount ?? 0} reason=${body?.reason ?? 'none'}`,
    );
    return this.paymentsService.refundPayment(id, body?.amount, body?.reason);
  }
}
