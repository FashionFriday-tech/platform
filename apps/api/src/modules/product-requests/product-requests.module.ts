import { Module } from '@nestjs/common';

import { UploadService } from '../upload/upload.service';
import { ProductRequestsController } from './product-requests.controller';
import { ProductRequestsService } from './product-requests.service';

@Module({
  controllers: [ProductRequestsController],
  providers: [ProductRequestsService, UploadService],
  exports: [ProductRequestsService],
})
export class ProductRequestsModule {}
