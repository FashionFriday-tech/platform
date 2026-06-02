import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { ReviewsService } from './reviews.service';

const UpdateReviewSchema = z.object({
  userName: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
  productImage: z.string().optional(),
  isActive: z.boolean().optional(),
});
class UpdateReviewDto extends createZodDto(UpdateReviewSchema) {}

@Controller('admin/reviews')
export class GlobalReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getAllReviews() {
    return this.reviewsService.getAllReviews();
  }

  @Patch(':id')
  async updateReview(@Param('id') id: string, @Body() data: UpdateReviewDto) {
    return this.reviewsService.updateReview(id, data);
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }
}
