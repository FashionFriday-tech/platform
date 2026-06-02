import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { WhatsAppReviewsController } from './whatsapp-reviews.controller';
import { WhatsAppReviewsService } from './whatsapp-reviews.service';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [WhatsAppReviewsController],
  providers: [WhatsAppReviewsService],
  exports: [WhatsAppReviewsService],
})
export class WhatsAppReviewsModule {}
