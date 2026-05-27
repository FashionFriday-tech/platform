import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ProductRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async getAllRequests() {
    return this.prisma.db.productRequest.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async checkRateLimit(userId: string): Promise<boolean> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const count = await this.prisma.db.productRequest.count({
      where: {
        userId,
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    });

    return count < 5;
  }

  async createRequest(userId: string, productName: string, file: Express.Multer.File) {
    // 1. Validate rate limit
    const isAllowed = await this.checkRateLimit(userId);
    if (!isAllowed) {
      throw new BadRequestException('Weekly sourcing request limit reached (max 5 per week).');
    }

    // 2. Upload file to Cloudflare S3 (under product-requests folder)
    let imageUrl = '';
    try {
      imageUrl = await this.uploadService.uploadFile(file, undefined, 'product-requests');
    } catch (err) {
      console.error('Failed to upload sourcing image:', err);
      throw new InternalServerErrorException('Failed to upload image. Please try again.');
    }

    // 3. Save to database
    return this.prisma.db.productRequest.create({
      data: {
        userId,
        productName,
        imageUrl,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }
}
