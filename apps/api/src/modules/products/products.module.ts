import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { AdminProductsController } from './controllers/admin-products.controller';
import { ProductsController } from './controllers/public-products.controller';
import { ProductsRepository } from './products.repository';
import { AdminProductsService } from './services/admin-products.service';
import { PublicProductsService } from './services/public-products.service';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [ProductsController, AdminProductsController],
  providers: [AdminProductsService, PublicProductsService, ProductsRepository],
  exports: [AdminProductsService, PublicProductsService],
})
export class ProductsModule {}
