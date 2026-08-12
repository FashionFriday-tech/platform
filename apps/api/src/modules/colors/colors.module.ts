import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { AdminColorsController, PublicColorsController } from './colors.controller';
import { ColorsRepository } from './colors.repository';
import { ColorsService } from './colors.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminColorsController, PublicColorsController],
  providers: [ColorsService, ColorsRepository],
  exports: [ColorsService, ColorsRepository],
})
export class ColorsModule {}
