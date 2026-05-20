import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/public-products.controller';
import { AdminProductsController } from './controllers/admin-products.controller';
import { AdminProductsService } from './services/admin-products.service';
import { PublicProductsService } from './services/public-products.service';
import { ProductsRepository } from './products.repository';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController, AdminProductsController],
  providers: [AdminProductsService, PublicProductsService, ProductsRepository],
  exports: [AdminProductsService, PublicProductsService],
})
export class ProductsModule {}
