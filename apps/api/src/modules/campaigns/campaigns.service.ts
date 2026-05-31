import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UploadService } from '../upload/upload.service';
import { triggerRevalidation } from '../revalidate-helper';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async getAllCampaigns() {
    return this.prisma.db.campaign.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActiveCampaigns() {
    return this.prisma.db.campaign.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCampaign(data: {
    title: string;
    mediaUrl: string;
    mediaType?: string;
    linkUrl: string;
    placement: string;
    isActive?: boolean;
  }) {
    const result = await this.prisma.db.campaign.create({
      data: {
        title: data.title,
        mediaUrl: data.mediaUrl,
        mediaType: data.mediaType ?? 'image',
        linkUrl: data.linkUrl,
        placement: data.placement,
        isActive: data.isActive ?? true,
      },
    });
    triggerRevalidation('home-campaigns');
    return result;
  }

  async updateCampaign(
    id: string,
    data: {
      title?: string;
      mediaUrl?: string;
      mediaType?: string;
      linkUrl?: string;
      placement?: string;
      isActive?: boolean;
    },
  ) {
    const existing = await this.prisma.db.campaign.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Campaign not found');

    // Clean up old Cloudflare R2 image if mediaUrl is being updated
    if (
      data.mediaUrl !== undefined &&
      data.mediaUrl !== existing.mediaUrl &&
      existing.mediaUrl &&
      existing.mediaUrl.startsWith('http') &&
      !existing.mediaUrl.includes('localhost') &&
      !existing.mediaUrl.includes('127.0.0.1')
    ) {
      try {
        await this.uploadService.deleteFile(existing.mediaUrl);
      } catch (err) {
        console.error('Failed to cleanup old campaign media:', err);
      }
    }

    const result = await this.prisma.db.campaign.update({
      where: { id },
      data,
    });
    triggerRevalidation('home-campaigns');
    return result;
  }

  async deleteCampaign(id: string) {
    const existing = await this.prisma.db.campaign.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Campaign not found');

    // Clean up Cloudflare R2 image
    if (
      existing.mediaUrl &&
      existing.mediaUrl.startsWith('http') &&
      !existing.mediaUrl.includes('localhost') &&
      !existing.mediaUrl.includes('127.0.0.1')
    ) {
      try {
        await this.uploadService.deleteFile(existing.mediaUrl);
      } catch (err) {
        console.error('Failed to delete campaign media:', err);
      }
    }

    const result = await this.prisma.db.campaign.delete({
      where: { id },
    });
    triggerRevalidation('home-campaigns');
    return result;
  }
}
