import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { AdminQualitiesController, PublicQualitiesController } from './qualities.controller';
import { QualitiesRepository } from './qualities.repository';
import { QualitiesService } from './qualities.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminQualitiesController, PublicQualitiesController],
  providers: [QualitiesService, QualitiesRepository],
  exports: [QualitiesService, QualitiesRepository],
})
export class QualitiesModule {}
