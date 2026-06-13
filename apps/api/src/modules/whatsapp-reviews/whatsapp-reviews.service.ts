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

  async getAllReviewsWithCount(limit?: number, offset?: number) {
    const [items, total] = await Promise.all([
      this.prisma.db.whatsAppReview.findMany({
        orderBy: { sortOrder: 'asc' },
        ...(limit !== undefined ? { take: limit } : {}),
        ...(offset !== undefined ? { skip: offset } : {}),
      }),
      this.prisma.db.whatsAppReview.count(),
    ]);

    return { items, total };
  }

  async getNextReviewNumber(): Promise<number> {
    const reviews = await this.prisma.db.whatsAppReview.findMany({
      select: { imageUrl: true },
    });

    let maxNum = 1000;
    for (const r of reviews) {
      const match =
        r.imageUrl.match(/fashion-friday-whatsapp-sales-review-(\d+)\.webp/i) ||
        r.imageUrl.match(/\/review-(\d+)\.webp/i) ||
        r.imageUrl.match(/review-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        // Exclude legacy millisecond timestamps (> 1 billion) so count starts cleanly from 1000
        if (!isNaN(num) && num >= 1000 && num < 1000000000 && num > maxNum) {
          maxNum = num;
        }
      }
    }

    return maxNum + 1;
  }

  async createReview(imageUrl: string) {
    const results = await this.createReviews([imageUrl]);
    return results[0];
  }

  async createReviews(imageUrls: string[]) {
    if (imageUrls.length === 0) return [];

    // Get current max sortOrder to append at the end
    const last = await this.prisma.db.whatsAppReview.findFirst({
      orderBy: { sortOrder: 'desc' },
    });
    const baseOrder = (last?.sortOrder ?? -1) + 1;

    const results = await this.prisma.db.$transaction(
      imageUrls.map((imageUrl, index) =>
        this.prisma.db.whatsAppReview.create({
          data: {
            imageUrl,
            sortOrder: baseOrder + index,
          },
        }),
      ),
    );

    this.triggerReviewsRevalidation();
    return results;
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
