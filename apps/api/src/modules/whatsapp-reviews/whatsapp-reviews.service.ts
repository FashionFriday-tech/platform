import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { triggerRevalidation } from '../revalidate-helper';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class WhatsAppReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async getAllReviews(limit?: number, offset?: number) {
    return this.prisma.db.whatsAppReview.findMany({
      orderBy: { sortOrder: 'asc' },
      ...(limit !== undefined ? { take: limit } : {}),
      ...(offset !== undefined ? { skip: offset } : {}),
    });
  }

  async createReview(imageUrl: string) {
    // Get current max sortOrder to append at the end
    const last = await this.prisma.db.whatsAppReview.findFirst({
      orderBy: { sortOrder: 'desc' },
    });
    const nextOrder = (last?.sortOrder ?? -1) + 1;

    const result = await this.prisma.db.whatsAppReview.create({
      data: {
        imageUrl,
        sortOrder: nextOrder,
      },
    });

    this.triggerReviewsRevalidation();
    return result;
  }

  async deleteReview(id: string) {
    const existing = await this.prisma.db.whatsAppReview.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Review not found');
    }

    // Clean up R2 image
    if (
      existing.imageUrl &&
      existing.imageUrl.startsWith('http') &&
      !existing.imageUrl.includes('localhost') &&
      !existing.imageUrl.includes('127.0.0.1')
    ) {
      try {
        await this.uploadService.deleteFile(existing.imageUrl);
      } catch (err) {
        console.error('Failed to delete review image:', err);
      }
    }

    const result = await this.prisma.db.whatsAppReview.delete({
      where: { id },
    });

    this.triggerReviewsRevalidation();
    return result;
  }

  private triggerReviewsRevalidation() {
    void triggerRevalidation('home-reviews');
    void triggerRevalidation('home-reviews', '/whatsapp-reviews');
  }
}
