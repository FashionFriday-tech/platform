import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { NotificationsModule } from '../notifications/notifications.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersReconciliationWorker } from './services/orders-reconciliation.worker';
import { RazorpayService } from './services/razorpay.service';

@Module({
  imports: [ConfigModule, NotificationsModule],
  controllers: [OrdersController],
  providers: [OrdersService, RazorpayService, OrdersReconciliationWorker],
  exports: [OrdersService, RazorpayService, OrdersReconciliationWorker],
})
export class OrdersModule {}
