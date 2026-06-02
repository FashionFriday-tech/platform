import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async getReviewsByProduct(productId: string) {
    return this.prisma.db.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllReviews() {
    return this.prisma.db.review.findMany({
      include: {
        product: {
          select: { name: true, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReview(data: {
    productId: string;
    userName: string;
    rating: number;
    comment: string;
    productImage?: string;
    isActive?: boolean;
  }) {
    return this.prisma.db.review.create({
      data: {
        productId: data.productId,
        userName: data.userName,
        rating: data.rating,
        comment: data.comment,
        productImage: data.productImage,
        isActive: data.isActive ?? true,
      },
    });
  }

  async updateReview(
    id: string,
    data: {
      userName?: string;
      rating?: number;
      comment?: string;
      productImage?: string;
      isActive?: boolean;
    },
  ) {
    const existing = await this.prisma.db.review.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Review not found');
    }

    if (
      data.productImage !== undefined &&
      data.productImage !== existing.productImage &&
      existing.productImage
    ) {
      try {
        await this.uploadService.deleteFile(existing.productImage);
      } catch (err) {
        console.error('Failed to delete old review image during update', err);
      }
    }

    return this.prisma.db.review.update({
      where: { id },
      data,
    });
  }

  async deleteReview(id: string) {
    const review = await this.prisma.db.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.productImage) {
      try {
        await this.uploadService.deleteFile(review.productImage);
      } catch (err) {
        console.error('Failed to clean up review image', err);
      }
    }

    return this.prisma.db.review.delete({
      where: { id },
    });
  }
}
