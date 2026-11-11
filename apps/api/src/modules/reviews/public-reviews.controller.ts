import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class PublicReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Group-level aggregated reviews for a product or modelGroup.
   */
  @Get('product/:idOrSlug')
  async getProductReviews(@Param('idOrSlug') idOrSlug: string) {
    return this.reviewsService.getReviewsByProduct(idOrSlug);
  }

  /**
   * Direct review submission by verified customers.
   */
  @Post()
  async submitReview(
    @Body()
    body: {
      productId: string;
      userName: string;
      rating: number;
      comment: string;
      productImage?: string;
    },
  ) {
    return this.reviewsService.createReview({
      productId: body.productId,
      userName: body.userName,
      rating: body.rating,
      comment: body.comment,
      productImage: body.productImage,
      isActive: true,
    });
  }
}
