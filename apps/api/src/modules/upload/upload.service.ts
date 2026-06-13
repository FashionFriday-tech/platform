import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import { join } from 'path';
import sharp from 'sharp';

@Injectable()
export class UploadService {
  private s3Client?: S3Client;

  constructor(private readonly configService?: ConfigService) {}

  private getR2Config() {
    const accountId = (
      this.configService?.get<string>('R2_ACCOUNT_ID') ||
      process.env.R2_ACCOUNT_ID ||
      ''
    )
      .replace(/["']/g, '')
      .trim();

    const accessKeyId = (
      this.configService?.get<string>('R2_ACCESS_KEY_ID') ||
      process.env.R2_ACCESS_KEY_ID ||
      ''
    )
      .replace(/["']/g, '')
      .trim();

    const secretAccessKey = (
      this.configService?.get<string>('R2_SECRET_ACCESS_KEY') ||
      process.env.R2_SECRET_ACCESS_KEY ||
      ''
    )
      .replace(/["']/g, '')
      .trim();

    const bucketName = (
      this.configService?.get<string>('R2_BUCKET_NAME') ||
      process.env.R2_BUCKET_NAME ||
      'fashionfriday-assets'
    )
      .replace(/["']/g, '')
      .trim();

    const publicUrl = (
      this.configService?.get<string>('R2_PUBLIC_URL') ||
      process.env.R2_PUBLIC_URL ||
      ''
    )
      .replace(/["']/g, '')
      .trim()
      .replace(/\/+$/, '');

    return { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl };
  }

  private getR2Client(): { client: S3Client; bucketName: string; publicUrl: string } {
    const { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl } = this.getR2Config();

    if (!accountId || !accessKeyId || !secretAccessKey || !publicUrl) {
      throw new InternalServerErrorException(
        'Cloudflare R2 is not configured in environment variables. Upload aborted.',
      );
    }

    if (!this.s3Client) {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }

    return { client: this.s3Client, bucketName, publicUrl };
  }

  async uploadFile(file: Express.Multer.File, slug?: string, folder?: string): Promise<string> {
    let processedBuffer = file.buffer;
    let fileExtension = file.originalname.split('.').pop() || 'bin';
    let contentType = file.mimetype;

    // Optimize images to webp automatically and crop to correct ratio
    if (contentType.startsWith('image/')) {
      try {
        // WhatsApp reviews & product request screenshots: convert to webp but keep full original dimensions (no resize/crop)
        if (folder === 'whatsapp-reviews' || folder === 'product-requests') {
          processedBuffer = await sharp(file.buffer).webp({ quality: 90 }).toBuffer();
          fileExtension = 'webp';
          contentType = 'image/webp';
        } else {
          let width = 900;
          let height = 1200;

          if (folder === 'campaigns/home-carousel') {
            width = 800;
            height = 1200; // 2:3
          } else if (folder === 'campaigns/products-list') {
            width = 2100;
            height = 900; // 21:9
          } else if (folder === 'campaigns/trending-products') {
            width = 900;
            height = 1200; // 3:4
          } else if (folder === 'campaigns/content-partners') {
            width = 900;
            height = 1500; // 3:5
          } else if (folder === 'campaigns/whatsapp-reviews') {
            width = 800;
            height = 600; // 4:3
          } else if (folder?.startsWith('campaigns')) {
            width = 900;
            height = 1200;
          }

          processedBuffer = await sharp(file.buffer)
            .resize({
              width,
              height,
              fit: 'cover',
              position: 'center',
            })
            .webp({ quality: 80 })
            .toBuffer();

          fileExtension = 'webp';
          contentType = 'image/webp';
        }
      } catch (err) {
        console.error('Failed to optimize image with sharp:', err);
        // Fallback to original buffer
      }
    }

    // Create a unique, clean name based on slug, review counter, or original file name
    let baseName = '';
    const isCampaign = folder?.startsWith('campaigns');
    const randomSuffix = Math.random().toString(36).substring(2, 8);

    if (slug) {
      baseName = slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    } else if (folder === 'whatsapp-reviews') {
      baseName = `review-${Date.now().toString(36)}`;
    } else {
      // Fallback to original file name without extension
      const originalWithoutExt =
        file.originalname.substring(0, file.originalname.lastIndexOf('.')) || file.originalname;
      baseName = `${originalWithoutExt
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')}-${randomSuffix}`;
    }

    if (!baseName) {
      baseName = `image-${randomSuffix}`;
    }

    if (isCampaign) {
      baseName = `poster-${baseName}`;
    }

    const fileName = `${baseName}.${fileExtension}`;

    // Construct the final key with an optional folder prefix (e.g. whatsapp-reviews/...)
    const fullPath = folder ? `${folder.replace(/^\/+|\/+$/g, '')}/${fileName}` : fileName;

    // Upload directly to Cloudflare R2. Strictly NO fallback to local disk storage.
    const { client, bucketName, publicUrl } = this.getR2Client();

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fullPath,
          Body: processedBuffer,
          ContentType: contentType,
        }),
      );

      return `${publicUrl}/${fullPath}`;
    } catch (error: any) {
      console.error(
        `Cloudflare R2 upload failed (${error?.name || 'Error'}: ${error?.message || 'Unknown'})`,
      );
      throw new InternalServerErrorException(
        `Failed to upload image to Cloudflare: ${error?.message || 'Storage error'}. Image was not saved.`,
      );
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // 1. If it's a legacy local upload, remove from disk
      if (fileUrl.includes('/uploads/')) {
        const relativePath = fileUrl.substring(fileUrl.indexOf('/uploads/') + '/uploads/'.length);
        const localPath = join(process.cwd(), 'uploads', relativePath);
        if (fs.existsSync(localPath)) {
          await fs.promises.unlink(localPath);
          return true;
        }
        return false;
      }

      // 2. If it's on Cloudflare R2
      const { client, bucketName, publicUrl } = this.getR2Client();
      if (publicUrl && fileUrl.startsWith(publicUrl)) {
        const key = fileUrl.substring(publicUrl.length).replace(/^\/+/, '');
        await client.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
          }),
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Failed to delete file (${fileUrl}):`, error);
      return false; // We just return false rather than throwing, so we don't block DB operations
    }
  }
}

