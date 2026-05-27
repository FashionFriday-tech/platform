import { Module } from '@nestjs/common';
import { ProductRequestsService } from './product-requests.service';
import { ProductRequestsController } from './product-requests.controller';
import { PrismaService } from '../../database/prisma.service';
import { UploadService } from '../upload/upload.service';

@Module({
  controllers: [ProductRequestsController],
  providers: [ProductRequestsService, PrismaService, UploadService],
  exports: [ProductRequestsService],
})
export class ProductRequestsModule {}
