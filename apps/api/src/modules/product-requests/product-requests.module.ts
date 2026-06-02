import { Module } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { UploadService } from '../upload/upload.service';
import { ProductRequestsController } from './product-requests.controller';
import { ProductRequestsService } from './product-requests.service';

@Module({
  controllers: [ProductRequestsController],
  providers: [ProductRequestsService, PrismaService, UploadService],
  exports: [ProductRequestsService],
})
export class ProductRequestsModule {}
