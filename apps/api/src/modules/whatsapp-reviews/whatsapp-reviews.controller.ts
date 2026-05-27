import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WhatsAppReviewsService } from './whatsapp-reviews.service';
import { UploadService } from '../upload/upload.service';

@Controller()
export class WhatsAppReviewsController {
  constructor(
    private readonly reviewsService: WhatsAppReviewsService,
    private readonly uploadService: UploadService,
  ) {}

  // Public endpoint for storefront
  @Get('whatsapp-reviews')
  async getReviews(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offsetNum = offset ? parseInt(offset, 10) : undefined;
    return this.reviewsService.getAllReviews(limitNum, offsetNum);
  }

  // Admin endpoint: List all reviews
  @Get('admin/whatsapp-reviews')
  async getAllReviews(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offsetNum = offset ? parseInt(offset, 10) : undefined;
    return this.reviewsService.getAllReviews(limitNum, offsetNum);
  }

  // Admin endpoint: Upload a new review image
  @Post('admin/whatsapp-reviews')
  @UseInterceptors(FileInterceptor('file'))
  async createReview(@UploadedFile() file: Express.Multer.File) {
    // Upload the image — folder 'whatsapp-reviews' tells upload service NOT to crop
    const imageUrl = await this.uploadService.uploadFile(file, undefined, 'whatsapp-reviews');
    return this.reviewsService.createReview(imageUrl);
  }

  // Admin endpoint: Delete a review
  @Delete('admin/whatsapp-reviews/:id')
  async deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }
}
