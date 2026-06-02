import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { AdminCollectionsController, PublicCollectionsController } from './collections.controller';
import { CollectionsRepository } from './collections.repository';
import { CollectionsService } from './collections.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminCollectionsController, PublicCollectionsController],
  providers: [CollectionsService, CollectionsRepository],
  exports: [CollectionsService],
})
export class CollectionsModule {}
