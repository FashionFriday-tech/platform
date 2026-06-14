import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { SearchLogsController } from './search-logs.controller';
import { SearchLogsService } from './search-logs.service';

@Module({
  imports: [PrismaModule],
  controllers: [SearchLogsController],
  providers: [SearchLogsService],
  exports: [SearchLogsService],
})
export class SearchLogsModule {}
