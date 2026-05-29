import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async createFeedback(type: string, description: string, email?: string) {
    const validTypes = ['issue', 'improvement', 'suggestion', 'other'];
    if (!validTypes.includes(type)) {
      throw new BadRequestException('Invalid feedback type.');
    }
    if (!description || description.trim().length < 5) {
      throw new BadRequestException('Description must be at least 5 characters long.');
    }

    return this.prisma.db.feedback.create({
      data: {
        type,
        description,
        email,
      },
    });
  }

  async getAllFeedback(limit = 50, offset = 0) {
    return this.prisma.db.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }
}
