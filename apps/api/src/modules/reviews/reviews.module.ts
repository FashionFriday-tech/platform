import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { GlobalReviewsController } from './global-reviews.controller';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [ReviewsController, GlobalReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
