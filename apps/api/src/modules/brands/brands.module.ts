import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { AdminBrandsController, PublicBrandsController } from './brands.controller';
import { BrandsRepository } from './brands.repository';
import { BrandsService } from './brands.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminBrandsController, PublicBrandsController],
  providers: [BrandsService, BrandsRepository],
  exports: [BrandsService],
})
export class BrandsModule {}
