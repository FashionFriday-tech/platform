import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { UploadService } from '../upload/upload.service';
import { WhatsAppReviewsService } from './whatsapp-reviews.service';

@Controller()
export class WhatsAppReviewsController {
  constructor(
    private readonly reviewsService: WhatsAppReviewsService,
    private readonly uploadService: UploadService,
  ) {}

  // Public endpoint for storefront
  @Get('whatsapp-reviews')
  async getReviews(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offsetNum = offset ? parseInt(offset, 10) : undefined;
    return this.reviewsService.getAllReviews(limitNum, offsetNum);
  }

  // Admin endpoint: List all reviews with total count
  @Get('admin/whatsapp-reviews')
  async getAllReviews(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offsetNum = offset ? parseInt(offset, 10) : undefined;
    return this.reviewsService.getAllReviewsWithCount(limitNum, offsetNum);
  }

  // Admin endpoint: Upload one or multiple review images
  @Post('admin/whatsapp-reviews')
  @UseInterceptors(AnyFilesInterceptor())
  async createReviews(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image file is required');
    }

    const imageFiles = files.filter((f) => f.mimetype.startsWith('image/'));
    if (imageFiles.length === 0) {
      throw new BadRequestException('Uploaded files must be images');
    }

    // Get next review number starting from 1000
    const startNumber = await this.reviewsService.getNextReviewNumber();

    // Upload all images in parallel with sequential names (fashion-friday-whatsapp-sales-review-1001, etc.)
    const uploadPromises = imageFiles.map((f, index) =>
      this.uploadService.uploadFile(
        f,
        `fashion-friday-whatsapp-sales-review-${startNumber + index}`,
        'whatsapp-reviews',
      ),
    );

    let imageUrls: string[];
    try {
      imageUrls = await Promise.all(uploadPromises);
    } catch (uploadError) {
      // If any upload fails, wait for settled promises and delete any successfully uploaded images to prevent orphans
      const settled = await Promise.allSettled(uploadPromises);
      for (const res of settled) {
        if (res.status === 'fulfilled' && res.value) {
          await this.uploadService.deleteFile(res.value).catch(() => {
            // Ignore cleanup error
          });
        }
      }
      throw uploadError;
    }

    const created = await this.reviewsService.createReviews(imageUrls);
    return created;
  }

  // Admin endpoint: Delete a review
  @Delete('admin/whatsapp-reviews/:id')
  async deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }
}
