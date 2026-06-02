import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { AdminCategoriesController, PublicCategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminCategoriesController, PublicCategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
