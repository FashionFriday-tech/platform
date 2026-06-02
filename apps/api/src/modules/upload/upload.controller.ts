import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadService } from './upload.service';

@Controller('admin/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('slug') slug?: string,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // You might want to add validation for file types (images only) and size here

    const url = await this.uploadService.uploadFile(file, slug, folder);
    return { url };
  }

  @Delete('batch')
  async deleteBatch(@Body('urls') urls: string[]) {
    if (!urls || !Array.isArray(urls)) {
      throw new BadRequestException('Urls array is required');
    }

    const results = [];
    for (const url of urls) {
      if (typeof url === 'string') {
        const success = await this.uploadService.deleteFile(url);
        results.push({ url, success });
      }
    }
    return { results };
  }
}
