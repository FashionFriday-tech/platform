import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
