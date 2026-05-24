import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('admin/products/:productId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getReviews(@Param('productId') productId: string) {
    return this.reviewsService.getReviewsByProduct(productId);
  }

  @Post()
  async createReview(
    @Param('productId') productId: string,
    @Body() body: { userName: string; rating: number; comment: string; productImage?: string; isActive?: boolean },
  ) {
    return this.reviewsService.createReview({
      productId,
      userName: body.userName,
      rating: body.rating,
      comment: body.comment,
      productImage: body.productImage,
      isActive: body.isActive,
    });
  }

  @Patch(':id')
  async updateReview(
    @Param('id') id: string,
    @Body() body: { userName?: string; rating?: number; comment?: string; productImage?: string; isActive?: boolean },
  ) {
    return this.reviewsService.updateReview(id, body);
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }
}
